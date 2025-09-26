import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
     email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true},
    birthday: { type: String, required: false},

   role: {
      type: String,
      enum: ["user", "admin", "doctor", "therapist", "supplier", "delivery"],
      default: "user",
    },

    staffType: {
      type: String,
      enum: ["doctor", "therapist", "supplier", "delivery"],
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    //isApproved: { type: Boolean, default: false },
    //isBlocked: { type: Boolean, default: false },
    profilePicture: { type: String, default: "https://via.placeholder.com/150" },

    deletionRequested: { type: Boolean, default: false },
    deletionRequestedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
