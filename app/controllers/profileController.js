import User from "../models/User.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const imageUrl = user.profileImage
            ? `${req.protocol}://${req.get("host")}/uploads/${user.profileImage}`
            : null;

        res.json({
            ...user.toObject(),
            profileImage: imageUrl,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, email, mobile, password } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;
        if (password && password.trim() !== "") user.password = password;

        if (req.file) user.profileImage = req.file.filename;

        await user.save();

        const imageUrl = user.profileImage
            ? `${req.protocol}://${req.get("host")}/uploads/${user.profileImage}`
            : null;

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                profileImage: imageUrl,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// export const uploadProfileImage = async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id);
//         if (!user) return res.status(404).json({ message: "User not found" });

//         if (req.file) {
//             user.profileImage = req.file.filename;
//             await user.save();

//             const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${user.profileImage}`;
//             res.json({ message: "Image uploaded successfully", profileImage: imageUrl });
//         } else {
//             res.status(400).json({ message: "No image uploaded" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
export const uploadProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        user.profileImage = req.file.filename;
        await user.save();

        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${user.profileImage}`;

        res.status(200).json({
            message: "Image uploaded successfully",
            profileImage: imageUrl,
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: error.message });
    }
};
