const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const validate = asyncHandler(async (req, res, next) => {
    try {
        let token = "";

        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
            res.status(400);
            throw new Error("Token not available");
        }

        token = req.headers.authorization.split(" ")[1];

        if (!token || token === "undefined" || token === "") {
            res.status(400);
            throw new Error("Token not available");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            },
        });

        if (!user) {
            res.status(400);
            throw new Error("Token not verified");
        }

        req.payload = {
            id: decoded.id,
            email: user.email,
            username: user.username,
            role: user.role
        };

        next();

    } catch (error) {
        res.status(error.status || 500)
        throw new Error(error.message || "Internal Server Error");
    }
});

module.exports = {
    validate
};
