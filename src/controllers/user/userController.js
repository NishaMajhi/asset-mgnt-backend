const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")
const { userRegisterInputValidation, generateUserName } = require("../../helper/userHelper")


const userRegister = asyncHandler(async (req, res) => {
    try {

        const { email, password, name, gender, phoneNumber, address } = req.body

        const inputValidate = await userRegisterInputValidation(req.body)
        if (!inputValidate.status) {
            res.status(400)
            throw new Error(inputValidate.message)
        }

        const checkUserExists = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (checkUserExists) {
            res.status(400)
            throw new Error(`An user already exists with email ${email}`)
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const userName = await generateUserName(name)

        let user = {
            username: userName,
            email: email,
            password: hashedPassword,
            name: name,
            gender: gender,
            phone_number: phoneNumber,
            address: address,
            role: "USER"
        }

        const insertUser = await prisma.user.create({
            data: user
        })
        if (!insertUser) {
            res.status(500)
            throw new Error(`Error while inserting user in DB`)
        }

        res.status(201).json({ message: "User Registered Successfully" })

    } catch (error) {
        throw new Error(error.message)
    }
})

const userLogin = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message)
    }
})

const viewUserProfile = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message)
    }
})

const updateUserProfile = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        throw new Error(error.message)
    }
})


module.exports = {
    userRegister,
    userLogin,
    viewUserProfile,
    updateUserProfile
}