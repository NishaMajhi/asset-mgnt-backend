const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client");
const { generateSlug } = require("../../helper/categoryHelper");
const prisma = new PrismaClient()


const addCategory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name === "") {
            res.status(400)
            throw new Error("Category name is required");
        }

        const slug = generateSlug(name);

        const category = await prisma.category.create({
            data: {
                name,
                slug
            }
        });

        res.status(201).json({ message: "Category added successfully", category })

    } catch (error) {
        throw new Error(error.message);
    }
})

const getCategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params

        const category = await prisma.category.findUnique({
            where: {
                id: categoryId * 1
            }
        })
        if (!category) {
            res.status(400)
            throw new Error("No category data found")
        }

        res.status(200).json(category)

    } catch (error) {
        throw new Error(error.message);
    }
})

const getCategories = asyncHandler(async (req, res) => {
    try {

        const categories = await prisma.category.findMany()
        if (!categories || categories.length === 0) {
            res.status(400)
            throw new Error("No category data found")
        }

        res.status(200).json(categories)

    } catch (error) {
        throw new Error(error.message);
    }
})


const updateCategory = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message);
    }
})


const deleteCategory = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message);
    }
})

module.exports = {
    addCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory
}