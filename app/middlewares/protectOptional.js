import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectOptional = async (req, res, next) => {
    const token = req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;

    if (!token) return next(); // user not logged in → still allowed (free articles)

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");
        return next();
    } catch (err) {
        return next(); // invalid token → treat as public user
    }
};
