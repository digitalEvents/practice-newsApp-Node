import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    content: { type: String, required: true },
    image: { type: String, default: "/no_profile_image.png" },
    category: { type: String, default: "General" },
    monetization: { type: String, enum: ["free", "paid"], default: "free" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 }
}, { timestamps: true });

articleSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
    }
    next();
});

articleSchema.methods.shortDescription = function (length = 100) {
    return this.description.length > length
        ? this.description.substring(0, length) + "..."
        : this.description;
};

export default mongoose.model("Article", articleSchema);
