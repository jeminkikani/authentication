const express = require("express");
const router = express.Router();
const {
    getUsers,
    removeUser,
    uploadProfileImage,
} = require("../controllers/userController");
const { auth } = require("../middleware/auth");
const { upload } = require("../utils/multer");

router.get("/", auth, getUsers);
router.delete("/:id", auth, removeUser);
router.post(
    "/upload-profile-image",
    auth,
    upload.single("profileImage"),
    uploadProfileImage
);

module.exports = router;
