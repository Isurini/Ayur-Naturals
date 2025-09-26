import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import PDFDocument from "pdfkit";

// helper: format user consistently
const formatUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  contactNumber: user.contactNumber,
  birthday: user.birthday,
  role: user.role,
  status: user.status,
  profilePicture: user.profilePicture || null,
  createdAt: user.createdAt,
});

// ========== AUTH ==========
// Signup (new users start as "pending")
export const signup = async (req, res) => {
  const { firstName, lastName, email, password, phone, birthday } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber: phone,
      birthday,
      password,
      role: "user",
      status: "pending",
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: formatUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login (only approved users can log in)
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (user.status !== "approved") {
        return res.status(401).json({ message: "Account not approved by admin" });
      }

      res.json({
        token: generateToken(user._id),
        user: formatUser(user),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== STAFF (Admin only) ==========
export const createStaff = async (req, res) => {
  const { firstName, lastName, email, staffType } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Staff already exists" });

    // auto-generate password
    const password = Math.random().toString(36).slice(-8);
    const staff = await User.create({
      firstName,
      lastName,
      email,
      password,
      staffType,
      role: staffType,
      status: "approved", // staff auto-approved
    });

    res.status(201).json({
      message: "Staff created",
      staff: {
        ...formatUser(staff),
        generatedPassword: password, // so admin can give it to staff
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== ADMIN ==========
export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users.map((u) => formatUser(u)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve / Reject / Set Pending
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: `User ${status}`, user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export all users as PDF
export const exportUsersPDF = async (req, res) => {
  try {
    const users = await User.find().select("firstName lastName email role status createdAt");
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=users.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("User Report", { align: "center" });
    doc.moveDown();

    users.forEach((u) => {
      doc
        .fontSize(12)
        .text(
          `${u.firstName} ${u.lastName} - ${u.email} - ${u.role} - ${u.status} - ${u.createdAt.toDateString()}`
        );
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Monthly signup stats
export const getMonthlyStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          signups: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const months = ["Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"];

    const formatted = stats.map((s) => ({
      month: months[s._id - 1],
      signups: s.signups,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== PROFILE ==========
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: formatUser(user) });
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { firstName, lastName, contactNumber, birthday, profilePicture } = req.body;
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (contactNumber !== undefined) user.contactNumber = contactNumber;
  if (birthday !== undefined) user.birthday = birthday;
  if (profilePicture !== undefined) user.profilePicture = profilePicture;

  await user.save();
  res.json({ message: "Profile updated", user: formatUser(user) });
};

// ========== DELETE REQUEST ==========
export const requestDeleteAccount = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.deletionRequested) {
    return res.status(400).json({ message: "Already requested deletion" });
  }

  user.deletionRequested = true;
  user.deletionRequestedAt = new Date();
  await user.save();

  res.json({ message: "Deletion requested" });
};

export const listDeletionRequests = async (req, res) => {
  const requests = await User.find({ deletionRequested: true }).select("-password");
  res.json(requests.map((u) => formatUser(u)));
};
