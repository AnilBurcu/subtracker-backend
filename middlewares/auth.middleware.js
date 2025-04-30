import {JWT_SECRET} from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// someone is making a request get user details -> authorize middleware -> verify -> if valid -> get user detail

const authorize = async (req, res, next) => {
    try {
        let token;

        // Extract token if header starts with "Bearer "
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If token is missing
        if (!token) {
            return res.status(401).json({ message: "Unauthorized Access: No token provided" });
        }

        // Verify and decode token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find user by ID from decoded token
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized Access: User not found" });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};

export default authorize;