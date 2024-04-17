const multer = require("multer")
const path = require('path')

const assetImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/asset');
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filePath = 'asset-' + uniqueSuffix + ext;
        cb(null, filePath);
    }
})

const addingAssetImage = multer({
    storage: assetImageStorage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB

    fileFilter: function (req, file, callback) {
        const acceptableExtensions = ['png', 'jpg', 'jpeg'];
        if (!(acceptableExtensions.some(extension =>
            path.extname(file.originalname).toLowerCase() === `.${extension}`)
        )) {
            return callback(new Error(`Extension not allowed, accepted extensions are ${acceptableExtensions.join(',')}`))
        }
        callback(null, true)
    },
});


module.exports = {
    addingAssetImage
}