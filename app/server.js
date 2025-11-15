// // import express from "express";
// // import dotenv from "dotenv";
// // import mongoose from "mongoose";
// // import cors from "cors";
// // import path from "path";
// // import { fileURLToPath } from "url";
// // import userRoutes from "./app/routes/userRoutes.js";

// // dotenv.config();
// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // app.use("/uploads", express.static(path.join(__dirname, "app/uploads")));

// // app.use(cors({ origin: "http://localhost:5173", credentials: true }));


// // app.use("/api/auth", userRoutes);
// // app.listen(8081, () => console.log("Server running on http://localhost:8081"));
// // const PORT = process.env.PORT || 8081;

// // mongoose
// //     .connect(process.env.MONGO_URI)
// //     .then(() => {
// //         console.log("MongoDB connected");
// //         app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //     })
// //     .catch((err) => console.error("MongoDB connection error:", err));
// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import userRoutes from "./app/routes/userRoutes.js";

// dotenv.config();
// const app = express();

// // ✅ Setup paths
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ Middleware
// app.use(express.json());
// app.use(
//     cors({
//         origin: "http://localhost:5173", // your React app URL
//         credentials: true,
//     })
// );

// // ✅ Serve static files (important for image display)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// console.log("Static files served from:", __dirname);

// // ✅ Routes
// app.use("/api/auth", userRoutes);

// // ✅ MongoDB connection
// const PORT = process.env.PORT || 8081;

// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => {
//         console.log("✅ MongoDB connected");

//         app.listen(PORT, () =>
//             console.log(`🚀 Server running at http://localhost:${PORT}`)
//         );
//     })
//     .catch((err) => console.error("❌ MongoDB connection error:", err));
