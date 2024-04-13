const express = require("express")
const { userRegister, userLogin, viewUserProfile, updateUserProfile } = require("../controllers/user/userController")
const userRouter = express.Router()

userRouter.post("/register", userRegister)
userRouter.post("/login", userLogin)
userRouter.get("/profile", viewUserProfile)
userRouter.put("/profile", updateUserProfile)

module.exports = {
    userRouter
}