import express from "express";
import {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle
} from "../controllers/articleController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { protectOptional } from "../middlewares/protectOptional.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public: free articles, or full if token + subscribed
router.get("/", protectOptional, getAllArticles);
router.get("/:id", protectOptional, getArticleById);

// Create/update/delete require roles
router.post("/", protect, authorizeRoles("editor", "admin", "writer"), upload.single("media"), createArticle);
router.put("/:id", protect, updateArticle);
router.delete("/:id", protect, authorizeRoles("admin"), deleteArticle);

export default router;
