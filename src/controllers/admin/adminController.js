const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")
const { adminLoginInputValidation } = require("../../helper/adminHelper")
const { generateToken } = require("../../helper/userHelper")

const adminLogin = asyncHandler(async (req, res) => {
    try {
        // Validate user input
        const inputValidate = await adminLoginInputValidation(req.body)
        if (!inputValidate.status) {
            res.status(400)
            throw new Error(inputValidate.message)
        }

        const { email, username, password } = req.body

        const checkUserExists = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        })
        if (!checkUserExists) {
            res.status(400)
            throw new Error("User not found")
        }


        if (checkUserExists && !await bcrypt.compare(password, checkUserExists.password)) {
            res.status(400)
            throw new Error("Wrong Credentials")
        }

        const token = await generateToken(checkUserExists.id)

        if (token && token.status) {
            res.status(200).json({ message: "Login successfully", role: checkUserExists.role, token: token.token })
        } else {
            res.status(400)
            throw new Error(token.message)
        }

    } catch (error) {
        throw new Error(error.message);
    }
})


const viewAdminProfile = asyncHandler(async (req, res) => {
    try {

        const { id } = req.payload

        const admin = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                username: true,
                email: true,
                name: true,
                gender: true,
                phone_number: true,
                address: true,
                role: true
            }
        })
        if (!admin) {
            res.status(400)
            throw new Error("User not found")
        }

        res.status(200).json(admin)

    } catch (error) {
        throw new Error(error.message);
    }
})

const updateAdminProfile = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message);
    }
})


module.exports = {
    adminLogin,
    viewAdminProfile,
    updateAdminProfile
}