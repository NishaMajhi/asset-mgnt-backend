const express = require("express")
const { userRegister, userLogin, viewUserProfile, updateUserProfile, updateUserPassword } = require("../controllers/user/userController")
const { validate } = require("../middlewares/authMiddleware")
const userRouter = express.Router()

userRouter.post("/register", userRegister)
userRouter.post("/login", userLogin)
userRouter.get("/profile", validate, viewUserProfile)
userRouter.put("/profile", validate, updateUserProfile)
userRouter.put("/password", validate, updateUserPassword)

module.exports = {
    userRouter
}