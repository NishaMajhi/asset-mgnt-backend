const express = require("express")
const { addAsset, getAssets, getAsset, updateAsset, deleteAsset, getAssetsByCategory } = require("../controllers/admin/assetController")
const { validate } = require("../middlewares/authMiddleware")
const { checkAdmin } = require("../middlewares/checkAdmin")
const { addingAssetImage } = require("../middlewares/imageUpload")
const assetRouter = express.Router()

assetRouter.post("/", validate, checkAdmin, addingAssetImage.single("image"), addAsset)
assetRouter.get("/", validate, checkAdmin, getAssets)
assetRouter.get("/:assetId", validate, checkAdmin, getAsset)
assetRouter.put("/", validate, checkAdmin, addingAssetImage.single("image"), updateAsset)
assetRouter.delete("/:assetId", validate, checkAdmin, deleteAsset)


assetRouter.get("/category/:categoryId", validate, getAssetsByCategory)


module.exports = {
    assetRouter
}