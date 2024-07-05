const User = require("../models/User");
const { upload } = require("../utils/multer");

const getUsers = async (req, res) => {
    const {
        status,
        startDate,
        endDate,
        city,
        state,
        country,
        hobbies,
        phone,
        email,
        name,
    } = req.query;

    const filter = {};

    if (status) filter.isActive = status === "active";
    if (startDate && endDate)
        filter.dob = { $gte: new Date(startDate), $lte: new Date(endDate) };
    if (city || state || country)
        filter.address = {
            $regex: `${city || ""}, ${state || ""}, ${country || ""}`,
            $options: "i",
        };
    if (hobbies) filter.hobbies = { $in: hobbies.split(",") };
    if (phone) filter.phone = { $regex: phone, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (name) filter.name = { $regex: name, $options: "i" };

    try {
        const users = await User.find(filter);
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

const removeUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });

        res.status(200).json({
            success: true,
            message: "User removed successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

const uploadProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });

        user.profileImage = req.file.path;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

module.exports = { getUsers, removeUser, uploadProfileImage };
