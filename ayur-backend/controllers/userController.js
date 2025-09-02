import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; //  use .env secret

//  Get all users (Admin use case)
export function getUsers(req, res) {
    User.find()
        .then((userList) => {
            res.json({ list: userList });
        })
        .catch((error) => {
            res.status(500).json({ message: "Error fetching users", error });
        });
}

//  Signup / Register user
export async function createUser(req, res) {
    try {
        const { email, firstName, lastName, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = new User({
            email,
            firstName,
            lastName,
            password: hashedPassword,
        });

        await user.save();

        res.json({ message: "User Created!" });
    } catch (err) {
        res.status(500).json({ message: "User not Created!", error: err.message });
    }
}

//  Login user
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Fetch JWT secret here
        const JWT_SECRET = process.env.JWT_SECRET;
        console.log("JWT_SECRET inside loginUser:", JWT_SECRET);

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, type: user.type },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                type: user.type,
                profilePicture: user.profilePicture,
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
}

//  Get user profile
export async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile", error: err.message });
    }
}

//  Update user profile
export async function updateProfile(req, res) {
    try {
        const { firstName, lastName, profilePicture } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName, profilePicture },
            { new: true }
        ).select("-password");

        res.json({ message: "Profile updated", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
}

//  Delete user (by email, for admin use)
export function deleteUser(req, res) {
    User.deleteOne({ email: req.params.email })
        .then(() => {
            res.json({ message: "User Deleted!" });
        })
        .catch((err) => {
            res.status(500).json({ message: "User not Deleted!", error: err });
        });
}
