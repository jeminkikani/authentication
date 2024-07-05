const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token)
        return res
            .status(401)
            .json({
                success: false,
                message: "No token, authorization denied",
            });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user)
            return res
                .status(401)
                .json({ success: false, message: "Authorization denied" });

        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Token is not valid" });
    }
};

module.exports = { auth };
