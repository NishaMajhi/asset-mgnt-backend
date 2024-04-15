const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const addAsset = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message);
    }
})

const getAsset = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message);
    }
})

const getAssets = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message);
    }
})


const updateAsset = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message);
    }
})

const deleteAsset = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message);
    }
})

module.exports = {
    addAsset,
    getAsset,
    getAssets,
    updateAsset,
    deleteAsset
}