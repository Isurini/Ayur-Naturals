import express from 'express';
import { getUsers, createUser, deleteUser, loginUser, getProfile, updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/",getUsers)

// Public routes
userRouter.post("/signup", createUser);
userRouter.post("/login", loginUser);

// Protected routes
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.put("/profile", authMiddleware, updateProfile);

userRouter.delete("/:email",deleteUser)

export default userRouter;