const express = require("express")
const { addAssetRequest, getAssetsRequestMadeByAnUser, getAssetRequestOfAnAsset, updateAssetRequestStatus, getAssetRequests } = require("../controllers/user/assetRequestController")
const assetRequestRouter = express.Router()


assetRequestRouter.post("/", addAssetRequest)
assetRequestRouter.get("/", getAssetRequests)
assetRequestRouter.get("/user/:userId", getAssetsRequestMadeByAnUser)
assetRequestRouter.get("/asset/:assetId", getAssetRequestOfAnAsset)
assetRequestRouter.put("/", updateAssetRequestStatus)

module.exports = {
    assetRequestRouter
}