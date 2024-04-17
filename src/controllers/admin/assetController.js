const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client")
const { addAssetInputValidation, updateAssetInputValidation } = require("../../utils/assetUtility")
const { removeImage } = require("../../utils/imageUploadUtility")
const prisma = new PrismaClient()

const addAsset = asyncHandler(async (req, res) => {

    let imageUrl = null

    try {

        const inputValidate = await addAssetInputValidation(req.body)
        if (!inputValidate.status) {
            res.status(400)
            throw new Error(inputValidate.message)
        }

        const { categoryId, name, model, manufacturingDate, expiryDate, price, description, quantity } = req.body

        const checkCategoryExists = await prisma.category.findUnique({
            where: {
                id: categoryId * 1
            }
        })
        if (!checkCategoryExists) {
            res.status(400)
            throw new Error("Category not found")
        }

        imageUrl = req.file ? req.file.path : null;
        if (imageUrl !== null) {
            console.log("passbook image uploaded successfully");
        }

        const insertAsset = await prisma.asset.create({
            data: {
                name: name,
                model: model,
                manufacturing_date: manufacturingDate === "" ? null : new Date(manufacturingDate),
                expiry_date: expiryDate === "" ? null : new Date(expiryDate),
                price: price * 1,
                description: (description !== "") ? JSON.stringify(description) : null,
                quantity: quantity ? quantity * 1 : 1,
                image: imageUrl,
                category: { connect: { id: checkCategoryExists.id } },
            }
        })
        if (!insertAsset) {
            res.status(500)
            throw new Error(`Error while inserting asset in DB`)
        }

        res.status(201).json({ message: "Asset Added Successfully" })

    } catch (error) {
        if (imageUrl !== null) {
            const ImageDelete = await removeImage(imageUrl);
        }
        throw new Error(error.message);
    }
})

const getAsset = asyncHandler(async (req, res) => {
    try {

        const { assetId } = req.params

        const asset = await prisma.asset.findUnique({
            where: {
                id: assetId * 1
            },
            select: {
                id: true,
                name: true,
                model: true,
                manufacturing_date: true,
                expiry_date: true,
                price: true,
                image: true,
                description: true,
                quantity: true,
                asset_availability_status: true,
                created_at: true,
                updated_at: true,
                category: {
                    select: {
                        id: true,
                        slug: true,
                        name: true
                    }
                }
            }
        })
        if (!asset) {
            res.status(400)
            throw new Error(`No Asset found of ID : ${assetId}`)
        }

        let assetData = {
            id: asset.id,
            name: asset.name,
            model: asset.model,
            manufacturingDate: asset.manufacturing_date,
            expiry_date: asset.expiry_date,
            price: asset.price,
            image: asset.image,
            description: JSON.parse(asset.description),
            quantity: asset.quantity,
            assetAvailabilityStatus: asset.asset_availability_status,
            createdAt: asset.created_at,
            lastModified: asset.updated_at,
            categoryId: asset.category.id,
            categoryName: asset.category.name
        }

        res.status(200).json(assetData)

    } catch (error) {
        throw new Error(error.message);
    }
})


const getAssets = asyncHandler(async (req, res) => {
    try {

        const assets = await prisma.asset.findMany({
            select: {
                id: true,
                name: true,
                model: true,
                manufacturing_date: true,
                expiry_date: true,
                price: true,
                image: true,
                description: true,
                quantity: true,
                asset_availability_status: true,
                created_at: true,
                updated_at: true,
                category: {
                    select: {
                        id: true,
                        slug: true,
                        name: true
                    }
                }
            }
        })
        if (!assets || assets.length < 0) {
            res.status(400)
            throw new Error("No Assets found")
        }

        let assetData = assets.map((asset) => {

            const assetObj = {
                id: asset.id,
                name: asset.name,
                model: asset.model,
                manufacturingDate: asset.manufacturing_date,
                expiry_date: asset.expiry_date,
                price: asset.price,
                image: asset.image,
                description: JSON.parse(asset.description),
                quantity: asset.quantity,
                assetAvailabilityStatus: asset.asset_availability_status,
                createdAt: asset.created_at,
                lastModified: asset.updated_at,
                categoryId: asset.category.id,
                categoryName: asset.category.name
            }

            return assetObj

        })

        res.status(200).json(assetData)

    } catch (error) {
        throw new Error(error.message);
    }
})


const getAssetsByCategory = asyncHandler(async (req, res) => {
    try {

        const { categoryId } = req.params

        const assets = await prisma.asset.findMany({
            where: {
                category_id: categoryId * 1
            },
            select: {
                id: true,
                name: true,
                model: true,
                manufacturing_date: true,
                expiry_date: true,
                price: true,
                image: true,
                description: true,
                quantity: true,
                asset_availability_status: true,
                created_at: true,
                updated_at: true,
                category: {
                    select: {
                        name: true
                    }
                }
            }
        })
        if (!assets || assets.length === 0) {
            res.status(400)
            throw new Error("No Asset found")
        }

        let assetData = assets.map((asset) => {

            const assetObj = {
                id: asset.id,
                name: asset.name,
                model: asset.model,
                manufacturingDate: asset.manufacturing_date,
                expiry_date: asset.expiry_date,
                price: asset.price,
                image: asset.image,
                description: JSON.parse(asset.description),
                quantity: asset.quantity,
                assetAvailabilityStatus: asset.asset_availability_status,
                createdAt: asset.created_at,
                lastModified: asset.updated_at,
                categoryName: asset.category.name
            }

            return assetObj

        })

        res.status(200).json(assetData)

    } catch (error) {
        throw new Error(error.message)
    }
})


const updateAsset = asyncHandler(async (req, res) => {
    try {

        const inputValidate = await updateAssetInputValidation(req.body)
        if (!inputValidate.status) {
            res.status(400)
            throw new Error(inputValidate.message)
        }

        const { assetId, name, model, manufacturingDate, expiryDate, price, description, quantity } = req.body

        const checkAssetExists = await prisma.asset.findUnique({
            where: {
                id: assetId * 1
            }
        })
        if (!checkAssetExists) {
            res.status(400)
            throw new Error("Asset not found")
        }

        let updatedData = {}

        if (name && name !== "" && name !== null) {
            updatedData.name = name
        }
        if (model && model !== "" && model !== null) {
            updatedData.model = model
        }
        if (manufacturingDate && manufacturingDate !== "" && manufacturingDate !== null) {
            updatedData.manufacturing_date = new Date(manufacturingDate)
        }
        if (expiryDate && expiryDate !== "" && expiryDate !== null) {
            updatedData.expiry_date = new Date(expiryDate)
        }
        if (price && price !== "" && price !== null) {
            updatedData.price = price * 1
        }
        if (description && description !== "" && description !== null) {
            updatedData.description = JSON.stringify(description)
        }
        if (quantity && quantity !== "" && quantity !== null) {
            updatedData.quantity = quantity * 1
        }

        const updateAssetData = await prisma.asset.update({
            where: {
                id: assetId * 1
            },
            data: updatedData
        })
        if (!updateAssetData) {
            res.status(500)
            throw new Error("Error while updating asset data")
        }

        res.status(201).json({ message: "Asset Upated Successfully" })

    } catch (error) {
        throw new Error(error.message);
    }
})


const deleteAsset = asyncHandler(async (req, res) => {
    try {

        const { assetId } = req.params

        const checkAssetExists = await prisma.asset.findUnique({
            where: {
                id: assetId * 1
            }
        })
        if (!checkAssetExists) {
            res.status(400)
            throw new Error("Asset not found")
        }

        const assetDelete = await prisma.asset.delete({
            where: {
                id: assetId * 1
            }
        })
        if (!assetDelete) {
            res.status(500)
            throw new Error("Error while deleting asset")
        }

        res.status(200).json({ message: "Asset Deleted Successfully" })

    } catch (error) {
        throw new Error(error.message);
    }
})

module.exports = {
    addAsset,
    getAsset,
    getAssets,
    updateAsset,
    deleteAsset,
    getAssetsByCategory,
}