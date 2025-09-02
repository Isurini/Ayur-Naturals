import jwt from "jsonwebtoken";
import User from "../models/user.js"; // make sure you have this model

export async function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Invalid token format" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch the full user from DB (exclude password)
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        req.user = user; // attach full user object
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
