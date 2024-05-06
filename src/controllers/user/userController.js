const asyncHandler = require("express-async-handler")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")
const { userRegisterInputValidation, generateUserName, userLoginInputValidation, userProfileUpdateInputValidation, userPasswordUpdateInputValidation, generateToken } = require("../../utils/userUtility")
const logger = require("../../middlewares/logger")


const userRegister = asyncHandler(async (req, res) => {
    try {

        // Validate user input
        const inputValidate = await userRegisterInputValidation(req.body)
        if (!inputValidate.status) {
            res.status(400)
            throw new Error(inputValidate.message)
        }

        const { email, password, name, gender, phoneNumber, address } = req.body

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

        const username = await generateUserName(name)

        let user = {
            username: username,
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
        logger.error(error.message)
        throw new Error(error.message);
    }
})

const userLogin = asyncHandler(async (req, res) => {
    try {

        // Validate user input
        const inputValidate = await userLoginInputValidation(req.body)
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

        if (token.status) {
            res.status(200).json({ message: "Login successfully", role: checkUserExists.role, token: token.token })
        } else {
            res.status(400)
            throw new Error(token.message)
        }

    } catch (error) {
        logger.error(error.message)
        throw new Error(error.message);
    }
})

const viewUserProfile = asyncHandler(async (req, res) => {
    try {

        const { id } = req.payload

        const user = await prisma.user.findUnique({
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
        if (!user) {
            res.status(400)
            throw new Error("User not found")
        }

        res.status(200).json(user)

    } catch (error) {
        logger.error(error.message)
        throw new Error(error.message);
    }
})

const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        const { id } = req.payload;

        // Validate user input
        const inputValidate = await userProfileUpdateInputValidation(req.body);
        if (!inputValidate.status) {
            res.status(400);
            throw new Error(inputValidate.message);
        }

        const { username, name, gender, phoneNumber, address } = req.body;

        let updatedData = {};

        if (username && username !== "") {
            updatedData.username = username;
        }
        if (name && name !== "") {
            updatedData.name = name;
        }
        if (gender && gender !== "") {
            updatedData.gender = gender;
        }
        if (phoneNumber) {
            updatedData.phone_number = phoneNumber;
        }
        if (address && address !== "") {
            updatedData.address = address;
        }

        // Update user profile in the database
        const updatedUserProfile = await prisma.user.update({
            where: { id },
            data: updatedData,
        });

        res.status(200).json({
            message: "User profile updated successfully",
            data: updatedUserProfile,
        });

    } catch (error) {
        logger.error(error.message)
        throw new Error(error.message);
    }
});


const updateUserPassword = asyncHandler(async (req, res) => {
    try {
        const { id } = req.payload

        const inputValidate = await userPasswordUpdateInputValidation(req.body)
        if (!inputValidate.status) {
            res.status(400);
            throw new Error(inputValidate.message);
        }

        const { password, newPassword } = req.body

        const checkUserExists = await prisma.user.findFirst({
            where: {
                id: id
            }
        })
        if (checkUserExists && await bcrypt.compare(password, checkUserExists.password)) {

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt)

            const updatedUserProfile = await prisma.user.update({
                where: { id },
                data: {
                    password: hashedPassword
                },
            });

            res.status(200).json({
                message: "password updated successfully",
            });

        }
        else {
            res.status(400);
            throw new Error("wrong password entered");
        }

    } catch (error) {
        logger.error(error.message)
        throw new Error(error.message);
    }
})


module.exports = {
    userRegister,
    userLogin,
    viewUserProfile,
    updateUserProfile,
    updateUserPassword
}