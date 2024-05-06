const express = require("express")
const { addAssetServiceRequest, updateAssetServiceRequestByAdmin, getAssetServiceRequests, getAssetServiceRequestsOfUser } = require("../controllers/user/assetServiceRequestController")
const assetServiceRequestRouter = express.Router()


assetServiceRequestRouter.post("/", addAssetServiceRequest)
assetServiceRequestRouter.get("/user/:userId", getAssetServiceRequestsOfUser)
assetServiceRequestRouter.put("/", updateAssetServiceRequestByAdmin)
assetServiceRequestRouter.get("/", getAssetServiceRequests)

module.exports = {
    assetServiceRequestRouter
}