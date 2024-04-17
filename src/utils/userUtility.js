const jwt = require("jsonwebtoken");


const userRegisterInputValidation = async (input) => {
    try {
        const { email, password, name, gender, phoneNumber, address } = input;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if (!email || email === "" || !emailRegex.test(email)) {
            return { status: false, message: 'Enter correct email' }
        }

        if (!password || password === "" || password.length < 4) {
            return { status: false, message: 'Password length should be greater than 4 digit' }
        }

        if (!phoneNumber || phoneNumber === "" || (phoneNumber.length !== 10)) {
            return { status: false, message: 'Phone number length should be 10 didgit' }
        }

        if (!name || name === "") {
            return { status: false, message: 'Name is required' }
        }

        if (!gender || gender === "") {
            return { status: false, message: 'Gender is required' }
        }

        if (!address || address === "") {
            return { status: false, message: 'Address is required' }
        }

        return { status: true, message: "" };

    } catch (error) {
        return { status: false, message: 'One or more required fields are missing.' }
    }
}

const generateUserName = async (name) => {

    const firstToChar = name.slice(0, 2).toUpperCase()
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    let userName = firstToChar + randomNumber

    return userName
}

const userLoginInputValidation = async (inputs) => {
    try {

        const { email, username, password } = inputs

        if ((!email || email === "") && (!username || username === "")) {
            return { status: false, message: 'Enter email or username' }
        }

        if (!password || password === "" || password.length < 4) {
            return { status: false, message: 'Password length should be greater than 4 digit' }
        }

        return { status: true, message: "" };

    } catch (error) {
        return { status: false, message: 'One or more required fields are missing.' }
    }

}

const generateToken = async (id) => {

    try {
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "30d" })
        return { token: token, status: true, message: "" }

    } catch (error) {
        return { token: "", status: false, message: "Error while generating token" }
    }

}


const userProfileUpdateInputValidation = async (inputs) => {
    try {
        const { username, name, gender, phoneNumber, address } = inputs

        if ((phoneNumber && phoneNumber !== "") && (phoneNumber.length !== 10)) {
            return { status: false, message: 'Phone number length should be 10 didgit' }
        }

        return { status: true, message: "" };

    } catch (error) {
        return { status: false, message: 'One or more required fields are missing.' }
    }
}

const userPasswordUpdateInputValidation = async (inputs) => {
    try {

        const { password, newPassword, confirmPassword } = inputs

        if (!password || password === "") {
            return { status: false, message: 'Password is required' }
        }

        if (!newPassword || newPassword === "") {
            return { status: false, message: 'new password is required' }
        }

        if (!confirmPassword || confirmPassword === "") {
            return { status: false, message: 'confirm password is required' }
        }

        if (newPassword != confirmPassword) {
            return { status: false, message: 'new password and confirm password mismatch' }
        }

        return { status: true, message: "" };

    } catch (error) {
        return { status: false, message: 'One or more required fields are missing.' }
    }
}


module.exports = {
    userRegisterInputValidation,
    generateUserName,
    userLoginInputValidation,
    generateToken,
    userProfileUpdateInputValidation,
    userPasswordUpdateInputValidation,

}