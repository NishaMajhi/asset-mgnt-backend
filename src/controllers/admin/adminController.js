const asyncHandler = require("express-async-handler")


const adminRegister = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message)
    }
})

const adminLogin = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message)
    }
})

const viewAdminProfile = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message)
    }
})

const updateAdminProfile = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message)
    }
})


module.exports = {
    adminRegister,
    adminLogin,
    viewAdminProfile,
    updateAdminProfile
}