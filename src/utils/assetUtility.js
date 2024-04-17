const addAssetInputValidation = async (inputs) => {
    try {
        const { categoryId, name, model, manufacturingDate, expiryDate, price, description, quantity } = inputs

        if (!categoryId || categoryId < 0) {
            return { status: false, message: 'Enter Category ID' }
        }

        if (!name || name === "") {
            return { status: false, message: 'Enter Asset name' }
        }

        if (!model || model === "") {
            return { status: false, message: 'Enter Model name' }
        }

        if (!price || price < 0) {
            return { status: false, message: 'Enter price' }
        }

        return { status: true, message: "" };

    } catch (error) {
        return { status: false, message: 'One or more required fields are missing.' }
    }
}


const updateAssetInputValidation = async (inputs) => {
    try {

        const { assetId, name, model, manufacturingDate, expiryDate, price, description, quantity } = inputs

        if (!assetId || assetId === null || assetId === "" || assetId < 0) {
            return { status: false, message: "Enter asset ID" };
        }

        if (price && price < 0) {
            return { status: false, message: "Enter price" };
        }

        return { status: true, message: "" };

    } catch (error) {
        return { status: false, message: 'One or more required fields are missing.' }

    }
}


module.exports = {
    addAssetInputValidation,
    updateAssetInputValidation,
}