import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ message: "Not authorized" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token invalid or expired" });
    }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
    next();
};

// Require subscription (paid) to access route
export const requireSubscription = (req, res, next) => {
    if (req.user?.subscription?.isSubscribed) return next();
    return res.status(403).json({ message: "Subscription required to access this content" });
};
