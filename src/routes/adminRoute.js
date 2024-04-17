const express = require("express")
const { adminLogin, viewAdminProfile, updateAdminProfile } = require("../controllers/admin/adminController")
const { validate } = require("../middlewares/authMiddleware")
const adminRouter = express.Router()

adminRouter.post("/login", adminLogin)
adminRouter.get("/profile", validate, viewAdminProfile)
adminRouter.put("/profile", validate, updateAdminProfile)


module.exports = {
    adminRouter
}