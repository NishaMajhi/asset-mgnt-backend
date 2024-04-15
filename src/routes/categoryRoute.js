const express = require("express")
const { addCategory, getCategories, getCategory, updateCategory, deleteCategory } = require("../controllers/admin/categoryController")
const { validate } = require("../middlewares/authMiddleware")
const { checkAdmin } = require("../middlewares/checkAdmin")
const categoryRouter = express.Router()

categoryRouter.post("/", validate, checkAdmin, addCategory)
categoryRouter.get("/", validate, checkAdmin, getCategories)
categoryRouter.get("/:categoryId", validate, checkAdmin, getCategory)
categoryRouter.put("/", validate, checkAdmin, updateCategory)
categoryRouter.delete("/", validate, checkAdmin, deleteCategory)


module.exports = {
    categoryRouter
}