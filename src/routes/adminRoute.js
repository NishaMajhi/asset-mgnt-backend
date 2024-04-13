const express = require("express")
const { adminRegister, adminLogin, viewAdminProfile, updateAdminProfile } = require("../controllers/admin/adminController")
const adminRouter = express.Router()

adminRouter.post("/register", adminRegister)
adminRouter.post("/login", adminLogin)
adminRouter.get("/profile", viewAdminProfile)
adminRouter.put("/profile", updateAdminProfile)

module.exports = {
    adminRouter
}