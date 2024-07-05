require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendResetEmail = (email, token) => {
    const url = `http://localhost:5000/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        html: `<p>Click <a href="${url}">here</a> to reset your password</p>`,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
