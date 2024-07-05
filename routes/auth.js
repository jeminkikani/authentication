const express = require("express");
const router = express.Router();
const {
    register,
    login,
    forgotPassword,
    resetPassword,
    signOut,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");

router.post("/signup", register);
router.post("/signin", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/signout", auth, signOut);

module.exports = router;
