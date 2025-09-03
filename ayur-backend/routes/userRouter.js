import express from 'express';
import { getUsers, createUser, deleteUser, loginUser, getProfile, updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/",getUsers)

//routes
userRouter.post("/signup", createUser);
userRouter.post("/login", loginUser);

userRouter.get("/profile", authMiddleware, getProfile);
userRouter.put("/profile", authMiddleware, updateProfile);

userRouter.delete("/:email",deleteUser)

export default userRouter;