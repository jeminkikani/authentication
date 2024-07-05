const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
    registerValidation,
    loginValidation,
    resetPasswordValidation,
} = require("../validations/auth");
const { sendResetEmail } = require("../utils/email");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error)
        return res
            .status(400)
            .json({ success: false, message: error.details[0].message });

    const { name, email, phone, password, gender, address, hobbies, dob } =
        req.body;

    try {
        const emailExists = await User.findOne({ email });
        if (emailExists)
            return res
                .status(400)
                .json({ success: false, message: "Email already exists" });

        const phoneExists = await User.findOne({ phone });
        if (phoneExists)
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Phone number already exists",
                });

        const user = new User({
            name,
            email,
            phone,
            password,
            gender,
            address,
            hobbies,
            dob,
        });
        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

const login = async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error)
        return res
            .status(400)
            .json({ success: false, message: error.details[0].message });

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "Invalid email or password" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch)
            return res
                .status(400)
                .json({ success: false, message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

const forgotPassword = async (req, res) => {
    const { error } = resetPasswordValidation(req.body);
    if (error)
        return res
            .status(400)
            .json({ success: false, message: error.details[0].message });

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "Email not found" });

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });

        await sendResetEmail(email, resetToken);

        res.status(200).json({
            success: true,
            message: "Password reset email sent",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

const resetPassword = async (req, res) => {
    const { error } = resetPasswordValidation(req.body);
    if (error)
        return res
            .status(400)
            .json({ success: false, message: error.details[0].message });

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "Email not found" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

const signOut = (req, res) => {
    res.status(200).json({ success: true, message: "Signed out successfully" });
};

module.exports = { register, login, forgotPassword, resetPassword, signOut };
