const asyncHandler = require("express-async-handler");
const { PrismaClient, IssueResolveStatus } = require("@prisma/client");
const prisma = new PrismaClient();

const addAssetServiceRequest = asyncHandler(async (req, res) => {
    try {
        const { userId, assetId, issueType, description } = req.body;

        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!userExists) {
            res.status(404);
            throw new Error("User not found");
        }

        const assetExists = await prisma.asset.findUnique({
            where: { id: assetId }
        });
        if (!assetExists) {
            res.status(404);
            throw new Error("Asset not found");
        }

        const assetServiceRequestExists = await prisma.asset_Service_Request.findFirst({
            where: {
                AND: [
                    { user_id: userId },
                    { asset_id: assetId }
                ]
            }
        });
        if (assetServiceRequestExists) {
            res.status(400);
            throw new Error("Service Request already present");
        }

        let jsonDesc = null;
        if (description !== null && description !== "") {
            jsonDesc = JSON.stringify(description);
        }

        const insertAssetServiceRequest = await prisma.asset_Service_Request.create({
            data: {
                user_id: userId,
                asset_id: assetId,
                issue_type: issueType,
                description: jsonDesc
            }
        });
        if (!insertAssetServiceRequest) {
            res.status(500);
            throw new Error("Data cant be inserted");
        }

        res.status(201).json({ message: "Service request made successfully" });
    } catch (error) {
        throw new Error(error.message);
    }
});

const getAssetServiceRequestsOfUser = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;

        const serviceRequests = await prisma.asset_Service_Request.findMany({
            where: { user_id: (userId * 1) },
            include: { asset: true }
        });
        if (serviceRequests.length === 0) {
            res.status(200).json([])
            return;
        }

        res.json(serviceRequests);

    } catch (error) {
        throw new Error(error.message);
    }
});

const getAssetServiceRequests = asyncHandler(async (req, res) => {
    try {
        const serviceRequests = await prisma.asset_Service_Request.findMany({
            include: { user: true, asset: true }
        });

        res.json(serviceRequests);
    } catch (error) {
        throw new Error(error.message);
    }
});

const updateAssetServiceRequestByAdmin = asyncHandler(async (req, res) => {
    try {
        const { serviceRequestId, resolveStatus } = req.body;

        const serviceRequestIdExists = await prisma.asset_Service_Request.findUnique({
            where: {
                id: serviceRequestId
            }
        })
        if (!serviceRequestIdExists) {
            res.status(404)
            throw new Error("service Request Id not found")
        }

        const updatedRequest = await prisma.asset_Service_Request.update({
            where: { id: serviceRequestId },
            data: { issue_resolve_status: resolveStatus }
        });

        res.json({ message: "Service request updated successfully", data: updatedRequest });

    } catch (error) {
        throw new Error(error.message);
    }
});

module.exports = {
    addAssetServiceRequest,
    updateAssetServiceRequestByAdmin,
    getAssetServiceRequests,
    getAssetServiceRequestsOfUser
};
