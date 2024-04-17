const express = require("express")
const { addAssetRequest, getAssetsRequestMadeByAnUser, getAssetRequestOfAnAsset, updateAssetRequestStatus, getAssetRequests } = require("../controllers/user/assetRequestController")
const { validate } = require("../middlewares/authMiddleware")
const { checkAdmin } = require("../middlewares/checkAdmin")
const assetRequestRouter = express.Router()


assetRequestRouter.post("/", addAssetRequest)
assetRequestRouter.get("/", validate, checkAdmin, getAssetRequests)
assetRequestRouter.get("/user/:userId", getAssetsRequestMadeByAnUser)
assetRequestRouter.get("/asset/:assetId", validate, checkAdmin, getAssetRequestOfAnAsset)
assetRequestRouter.put("/", validate, checkAdmin, updateAssetRequestStatus)

module.exports = {
    assetRequestRouter
}