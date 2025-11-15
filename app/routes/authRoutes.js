import express from "express";
import { login, signup, forgetPassword } from "../controllers/authController.js";
import {
    getProfile,
    uploadProfileImage,
    updateProfile
} from "../controllers/profileController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ======================
// AUTH ROUTES
// ======================
router.post("/signup", signup);
router.post("/login", login);
router.post("/forget-password", forgetPassword);

// ======================
// PROFILE ROUTES
// ======================
router.get("/profile", protect, getProfile);

router.post(
    "/upload",
    protect,
    upload.single("profileImage"),
    uploadProfileImage
);

router.post(
    "/updateProfile",
    protect,
    upload.single("profileImage"),
    updateProfile
);

export default router;