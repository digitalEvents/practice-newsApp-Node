import User from "../models/User.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

const generateToken = (user) =>
    jwt.sign(
        {
            id: user._id,
            role: user.role,
            isSubscribed: user.subscription?.isSubscribed || false,
        },
        JWT_SECRET,
        { expiresIn: "30d" }
    );

// SIGNUP
export const signup = async (req, res) => {
    try {
        const { name, email, password, mobile, role } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password, mobile, role });

        const token = generateToken(user);

        res.status(201).json({
            message: "Signup successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscription: user.subscription,
            },
        });
    } catch (err) {
        console.error("SIGNUP ERROR:", err); // <---- ADD THIS
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // Use schema helper to compare
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = generateToken(user);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscription: user.subscription,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// FORGET / RESET PASSWORD
export const forgetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // assign new password (schema pre('save') will hash it)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
