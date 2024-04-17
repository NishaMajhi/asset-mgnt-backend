const addAssetInputValidation = async (inputs) => {
    try {

        const { userId, assetId, description, assetRequestType } = inputs

        if (!userId || userId === null || userId === "" || userId < 0) {
            return { status: false, message: "Enter user ID" };
        }

        if (!assetId || assetId === null || assetId === "" || assetId < 0) {
            return { status: false, message: "Enter asset ID" };
        }

        if (!assetRequestType || assetRequestType === null || assetRequestType === "" || (assetRequestType !== "BORROW" && assetRequestType !== "RETURN")) {
            return { status: false, message: "Enter asset request type" };
        }

        return { status: true, message: "" };

    } catch (error) {
        return { status: false, message: 'One or more required fields are missing.' }
    }
}

module.exports = {
    addAssetInputValidation
}