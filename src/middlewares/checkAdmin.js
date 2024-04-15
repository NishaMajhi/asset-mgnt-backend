const asyncHandler = require("express-async-handler");

const checkAdmin = asyncHandler(async (req, res, next) => {
    try {

        const { role } = req.payload

        if (role !== "ADMIN") {
            res.status(401)
            throw new Error("Access denied")
        }

        return next()

    } catch (error) {
        throw new Error(error.message);
    }

})

module.exports = {
    checkAdmin
}