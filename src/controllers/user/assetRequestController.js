const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client")
const { addAssetInputValidation } = require("../../utils/assetRequestUtility")
const prisma = new PrismaClient()


const addAssetRequest = asyncHandler(async (req, res) => {
    try {

        const inputValidate = await addAssetInputValidation(req.body)
        if (!inputValidate.status) {
            res.status(400)
            throw new Error(inputValidate.message)
        }

        const { userId, assetId, description, assetRequestType } = req.body

        const checkUserExists = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!checkUserExists) {
            res.status(400)
            throw new Error("User not found")
        }

        const checkAssetExists = await prisma.asset.findUnique({
            where: {
                id: assetId
            }
        })
        if (!checkAssetExists) {
            res.status(400)
            throw new Error("Asset not found")
        }

        const checkAssetAlreadyAssigned = await prisma.asset_Request.findFirst({
            where: {
                AND: [
                    { user_id: userId },
                    { asset_id: assetId }
                ]
            }
        })

        if (assetRequestType === "BORROW") {

            if (checkAssetAlreadyAssigned) {
                res.status(400)
                throw new Error("Asset already assigned to user")
            }

            let assetRequestData = {
                user_id: userId,
                asset_id: assetId,
                description: (description === null || description === "") ? null : JSON.stringify(description),
                asset_request_type: assetRequestType
            }

            const assignAsset = await prisma.asset_Request.create({
                data: assetRequestData
            })
            if (!assignAsset) {
                res.status(500)
                throw new Error("Error while insert asset request")
            }

            res.status(201).json({ message: `Asset ${assetRequestType} Request done Successfully` })

        }
        else if (assetRequestType === "RETURN") {

            if (!checkAssetAlreadyAssigned) {
                res.status(400)
                throw new Error("Asset not assigned to user")
            }

            const addReturnRequest = await prisma.asset_Request.update({
                where: {
                    id: checkAssetAlreadyAssigned.id
                },
                data: {
                    asset_request_type: "RETURN"
                }
            })
            if (!addReturnRequest) {
                res.status(500)
                throw new Error("Error while adding return request")
            }

            res.status(201).json({ message: `Asset ${assetRequestType} Request done Successfully` })
        }

    } catch (error) {
        throw new Error(error.message)
    }
})


const updateAssetRequestStatus = asyncHandler(async (req, res) => {
    try {
        const { assetRequestId, assetRequestStatus } = req.body;

        if (!assetRequestId || !assetRequestStatus) {
            return res.status(400).json({ error: "assetRequestId and assetRequestStatus are required." });
        }

        const assetRequest = await prisma.asset_Request.findUnique({
            where: { id: assetRequestId },
            include: { asset: true }
        });

        if (!assetRequest) {
            res.status(400)
            throw new Error("Asset request not found.");
        }

        let updateStatus;
        let message;

        switch (assetRequestStatus) {
            case "REJECTED":
                updateStatus = await prisma.asset_Request.update({
                    where: { id: assetRequestId },
                    data: { asset_request_status: "REJECTED" }
                });
                message = "Request rejected successfully";
                break;

            case "BORROW":
                if (assetRequest.asset_request_type === "BORROW" && assetRequest.asset.quantity > 0) {
                    updateStatus = await prisma.$transaction([
                        prisma.asset_Request.update({
                            where: { id: assetRequestId },
                            data: { asset_request_status: assetRequestStatus }
                        }),
                        prisma.asset.update({
                            where: { id: assetRequest.asset.id },
                            data: { quantity: { decrement: 1 } }
                        })
                    ]);
                    message = "Asset assigned successfully";
                } else {
                    res.status(400)
                    throw new Error("Quantity less than 1 or incorrect asset request type.");
                }
                break;

            case "RETURN":
                if (assetRequest.asset_request_type === "RETURN") {
                    updateStatus = await prisma.$transaction([
                        prisma.asset_Request.update({
                            where: { id: assetRequestId },
                            data: { asset_request_status: assetRequestStatus }
                        }),
                        prisma.asset.update({
                            where: { id: assetRequest.asset.id },
                            data: { quantity: { increment: 1 } }
                        })
                    ]);
                    message = "Asset returned successfully";
                } else {
                    res.status(400)
                    throw new Error("Incorrect asset request type for returning asset.");
                }
                break;

            default:
                res.status(400)
                throw new Error("Invalid asset request status.");
        }

        res.status(201).json({ message });

    } catch (error) {
        throw new Error(error.message)
    }
});



const getAssetRequests = asyncHandler(async (req, res) => {
    try {

        const assetRequests = await prisma.asset_Request.findMany()
        if (!assetRequests || assetRequests.length === 0) {
            res.status(400)
            throw new Error("No Asset requests found")
        }

        res.status(200).json(assetRequests)

    } catch (error) {
        throw new Error(error.message)
    }
})


const getAssetsRequestMadeByAnUser = asyncHandler(async (req, res) => {
    try {

        const { userId } = req.params

        const assets = await prisma.asset_Request.findMany({
            where: {
                user_id: userId * 1
            },
            select: {
                id: true,
                user_id: true,
                asset_id: true,
                description: true,
                asset_request_type: true,
                asset_request_status: true,
                created_at: true,
                updated_at: true,
                asset: {
                    select: {
                        id: true,
                        name: true,
                        model: true,
                        manufacturing_date: true,
                        expiry_date: true,
                        price: true,
                        image: true,
                        description: true,
                        asset_availability_status: true,
                        created_at: true,
                        updated_at: true,
                        category: {
                            select: {
                                name: true
                            }
                        }
                    }
                }

            }
        })
        if (!assets || assets.length === 0) {
            res.status(400)
            throw new Error("No Asset request found")
        }

        let assetData = assets.map((asset) => {

            const assetObj = {
                id: asset.id,
                assetRequestType: asset.asset_request_type,
                assetRequestStatus: asset.asset_request_status,
                createdAt: asset.created_at,
                lastModified: asset.updated_at,
                asset: {
                    id: asset.asset.id,
                    name: asset.asset.name,
                    model: asset.asset.model,
                    manufacturingDate: asset.asset.manufacturing_date,
                    expiry_date: asset.asset.expiry_date,
                    price: asset.asset.price,
                    image: asset.asset.image,
                    description: JSON.parse(asset.asset.description),
                    quantity: asset.asset.quantity,
                    assetAvailabilityStatus: asset.asset.asset_availability_status,
                    createdAt: asset.asset.created_at,
                    lastModified: asset.asset.updated_at,
                    category: {
                        name: asset.asset.category.name
                    }
                }
            }

            return assetObj
        })

        res.status(200).json(assetData)

    } catch (error) {
        throw new Error(error.message)
    }
})


const getAssetRequestOfAnAsset = asyncHandler(async (req, res) => {
    try {

        const { assetId } = req.params

        const users = await prisma.asset_Request.findMany({
            where: {
                asset_id: assetId * 1
            },
            select: {
                id: true,
                user_id: true,
                asset_id: true,
                description: true,
                asset_request_type: true,
                asset_request_status: true,
                created_at: true,
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                        gender: true,
                    }
                }

            }
        })
        if (!users || users.length === 0) {
            res.status(400)
            throw new Error("No Asset request found")
        }

        let userData = users.map((user) => {

            const userObj = {
                id: user.id,
                assetRequestType: user.asset_request_type,
                assetRequestStatus: user.asset_request_status,
                createdAt: user.created_at,
                lastModified: user.updated_at,
                user: {
                    id: user.user.id,
                    username: user.user.username,
                    email: user.user.email,
                    name: user.user.name,
                    gender: user.user.gender
                }
            }

            return userObj
        })

        res.status(200).json(userData)

    } catch (error) {
        throw new Error(error.message)
    }
})


module.exports = {
    addAssetRequest,
    getAssetRequests,
    getAssetsRequestMadeByAnUser,
    getAssetRequestOfAnAsset,
    updateAssetRequestStatus,
}