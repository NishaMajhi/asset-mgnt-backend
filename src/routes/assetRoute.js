const express = require("express")
const { addAsset, getAssets, getAsset, updateAsset, deleteAsset } = require("../controllers/admin/assetController")
const { validate } = require("../middlewares/authMiddleware")
const { checkAdmin } = require("../middlewares/checkAdmin")
const assetRouter = express.Router()

assetRouter.post("/", validate, checkAdmin, addAsset)
assetRouter.get("/", validate, checkAdmin, getAssets)
assetRouter.get("/:assetId", validate, checkAdmin, getAsset)
assetRouter.put("/", validate, checkAdmin, updateAsset)
assetRouter.delete("/", validate, checkAdmin, deleteAsset)


module.exports = {
    assetRouter

}