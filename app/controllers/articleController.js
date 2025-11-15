import Article from "../models/Article.js";
import User from "../models/User.js";

export const createArticle = async (req, res) => {
    try {
        const { title, description, content, category, monetization } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const article = await Article.create({
            title, description, content, category, monetization: monetization || "free",
            image, author: req.user._id
        });
        res.status(201).json({ message: "Article created", article });
    } catch (err) {
        res.status(500).json({ message: "Error creating article", error: err.message });
    }
};

export const getAllArticles = async (req, res) => {
    try {
        let user = null;
        if (req.headers.authorization?.startsWith("Bearer ")) {
            try { // non-fatal
                const token = req.headers.authorization.split(" ")[1];
                // decode token to get id (fast, no DB) OR prefer protect middleware if route uses it
                // For simplicity, we won't rely on decode here — if route uses protect, req.user exists
            } catch (e) { }
        }

        // If route mounted without protect, we will filter by monetization free only.
        // To keep it simple: if req.user && req.user.subscription.isSubscribed -> return all, else free only
        const filter = (req.user && req.user.subscription?.isSubscribed) ? {} : { monetization: "free" };
        const articles = await Article.find(filter).populate("author", "name role").sort({ createdAt: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: "Error fetching articles", error: err.message });
    }
};

// Get single article; if paid -> require subscription or editor/admin
export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate("author", "name role");
        if (!article) return res.status(404).json({ message: "Article not found" });

        if (article.monetization === "paid") {
            // if request contains user (via protect) and user is subscribed OR role editor/admin -> allow
            if (req.user && (req.user.subscription?.isSubscribed || ["editor", "admin"].includes(req.user.role))) {
                return res.json(article);
            }
            return res.status(403).json({ message: "Subscription required to access this article" });
        }

        res.json(article);
    } catch (err) {
        res.status(500).json({ message: "Error fetching article", error: err.message });
    }
};

export const updateArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        // Only author, editor, or admin can update
        if (article.author.toString() !== req.user._id.toString() && !["editor", "admin"].includes(req.user.role)) {
            return res.status(403).json({ message: "Not allowed to update" });
        }

        Object.assign(article, req.body);
        if (req.file) article.image = `/uploads/${req.file.filename}`;
        await article.save();
        res.json({ message: "Article updated", article });
    } catch (err) {
        res.status(500).json({ message: "Error updating", error: err.message });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        // Only admin can delete (customizable)
        if (req.user.role !== "admin") return res.status(403).json({ message: "Only admin can delete" });

        await article.remove();
        res.json({ message: "Article deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting", error: err.message });
    }
};
