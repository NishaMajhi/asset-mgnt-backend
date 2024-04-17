const adminLoginInputValidation = async (inputs) => {
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


module.exports = {
    adminLoginInputValidation
}