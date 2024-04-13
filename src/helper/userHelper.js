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

module.exports = {
    userRegisterInputValidation,
    generateUserName
}