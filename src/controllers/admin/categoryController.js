const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client");
const { generateSlug } = require("../../utils/categoryUtility");
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
            res.status(404)
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
            res.status(404).json([])
            return;
        }

        res.status(200).json(categories)

    } catch (error) {
        throw new Error(error.message);
    }
})


const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;

        const categoryIdExists = await prisma.category.findUnique({
            where: {
                id: parseInt(categoryId)
            }
        })
        if (!categoryIdExists) {
            res.status(404)
            throw new Error("Category ID not found")
        }

        const updatedCategoryData = await prisma.category.update({
            where: { id: parseInt(categoryId) },
            data: { name }
        });

        res.status(200).json({ message: "Category updated successfully", updatedCategoryData });

    } catch (error) {
        throw new Error(error.message);
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;

        const categoryIdExists = await prisma.category.findUnique({
            where: {
                id: parseInt(categoryId)
            }
        })
        if (!categoryIdExists) {
            res.status(404)
            throw new Error("Category ID not found")
        }

        await prisma.category.delete({
            where: { id: parseInt(categoryId) }
        });

        res.status(200).json({ message: "Category deleted successfully" });

    } catch (error) {
        throw new Error(error.message);
    }
});

module.exports = {
    addCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory
}