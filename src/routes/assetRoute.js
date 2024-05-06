const express = require("express")
const { addAsset, getAssets, getAsset, updateAsset, deleteAsset, getAssetsByCategory } = require("../controllers/admin/assetController")
const { addingAssetImage } = require("../middlewares/imageUpload")
const assetRouter = express.Router()

assetRouter.post("/", addingAssetImage.single("image"), addAsset)
assetRouter.get("/", getAssets)
assetRouter.get("/:assetId", getAsset)
assetRouter.put("/", addingAssetImage.single("image"), updateAsset)
assetRouter.delete("/:assetId", deleteAsset)


assetRouter.get("/category/:categoryId", getAssetsByCategory)


module.exports = {
    assetRouter
}