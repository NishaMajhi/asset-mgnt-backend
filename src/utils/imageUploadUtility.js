async function removeImage(filePath) {
    try {
        const file = filePath.replace(process.env.SERVER_URL + '/', '');
        fs.unlink(file, (err) => {
            if (err) {
                console.log("Error while Deleting Credit Image", file)
                return false
            } else {
                console.log("Credit Image Delete Successfully")
                return true
            }
        })
        return true

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    removeImage
}