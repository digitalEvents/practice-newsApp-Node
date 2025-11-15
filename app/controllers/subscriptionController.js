import User from "../models/User.js";

export const subscribe = async (req, res) => {
    try {
        // Simulated subscription: set isSubscribed true and expiryDate 30 days from now
        const user = await User.findById(req.user._id);
        user.subscription.isSubscribed = true;
        user.subscription.expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await user.save();
        res.json({ message: "Subscribed", subscription: user.subscription });
    } catch (err) {
        res.status(500).json({ message: "Subscription error", error: err.message });
    }
};

export const cancelSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.subscription.isSubscribed = false;
        user.subscription.expiryDate = null;
        await user.save();
        res.json({ message: "Subscription cancelled" });
    } catch (err) {
        res.status(500).json({ message: "Cancel error", error: err.message });
    }
};
