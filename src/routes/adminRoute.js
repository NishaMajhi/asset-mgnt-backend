const express = require("express")
const { adminLogin, viewAdminProfile, updateAdminProfile } = require("../controllers/admin/adminController")
const { validate } = require("../middlewares/authMiddleware")
const { categoryRouter } = require("./categoryRoute")
const { assetRouter } = require("./assetRoute")
const adminRouter = express.Router()

adminRouter.post("/login", adminLogin)
adminRouter.get("/profile", validate, viewAdminProfile)
adminRouter.put("/profile", validate, updateAdminProfile)


//category routes
adminRouter.use("/category", categoryRouter)

//asset routes
adminRouter.use("/asset", assetRouter)

module.exports = {
    adminRouter
}