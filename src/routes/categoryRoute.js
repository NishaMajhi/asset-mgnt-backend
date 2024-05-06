const express = require("express")
const { addCategory, getCategories, getCategory, updateCategory, deleteCategory } = require("../controllers/admin/categoryController")
const categoryRouter = express.Router()

categoryRouter.post("/", addCategory)
categoryRouter.get("/", getCategories)
categoryRouter.get("/:categoryId", getCategory)
categoryRouter.put("/:categoryId", updateCategory)
categoryRouter.delete("/:categoryId", deleteCategory)


module.exports = {
    categoryRouter
}