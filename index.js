import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./app/utilis/db.js";
import authRoutes from "./app/routes/authRoutes.js";
import articleRoutes from "./app/routes/articleRoutes.js";
import subscriptionRoutes from "./app/routes/subscriptionRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import User from "./app/models/User.js";

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'app/uploads')));

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
export async function protectOptional(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return next();
        if (!authHeader.startsWith("Bearer ")) return next();

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user) req.user = user;
        return next();
    } catch (err) {
        return next();
    }
}

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/subscription", subscriptionRoutes);

app.get("/", (req, res) => res.json({ message: "API running" }));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
