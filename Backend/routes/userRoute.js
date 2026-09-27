const express= require("express");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    changePassword
}=require("../controllers/userController");

const {
    createUserValidator,
    updateUserValidator,
    getUserValidator,
    deleteUserValidator,
    changePasswordValidator
}=require("../validator/userValidator");

const router = express.Router();

router.route("/")
    .get(protect, allowedTo("admin"), getUsers)
    .post(protect, allowedTo("admin"), createUserValidator, validatorMiddleware, createUser);

router.route("/:uuid")
    .get(protect, allowedTo("admin", "sameUser"), getUserValidator, validatorMiddleware, getUser)
    .put(protect, allowedTo("admin", "sameUser"), updateUserValidator, validatorMiddleware, updateUser)
    .patch(protect, allowedTo("admin"), changePasswordValidator, validatorMiddleware, changePassword)
    .delete(protect, allowedTo("admin", "sameUser"), deleteUserValidator, validatorMiddleware, deleteUser);


module.exports = router;