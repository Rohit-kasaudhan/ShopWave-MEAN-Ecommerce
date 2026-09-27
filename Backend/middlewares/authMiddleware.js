const jwt = require("jsonwebtoken");
const User = require("../models/user");



exports.protect = async (req, res, next) => {
    try{
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not logged in! Please log in to get access.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: "The user belonging to this token does no longer exist.",
            });
        }

        if (currentUser.passwordChangedAt) {
            const changedTimestamp = parseInt(
                currentUser.passwordChangedAt.getTime() / 1000,
                10
            );

            if (decoded.iat < changedTimestamp) {
                return res.status(401).json({
                success: false,
                message: "Password changed, please login again",
                });
            }
        }
        req.user = currentUser;
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.allowedTo = (...roles) => {
    return (req, res, next) => {
        
        const isSameUser = 
            roles.includes("sameUser") &&
            req.user.uuid === req.params.uuid;

        const isAllowedRole = roles.includes(req.user.role);

        if (!isAllowedRole && !isSameUser) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this route"
            });
        }

        next();
    };
}