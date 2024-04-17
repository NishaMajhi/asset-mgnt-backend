const express = require("express")
const cors = require("cors")
const path = require('path');
const { userRouter } = require("./src/routes/userRoute");
const { adminRouter } = require("./src/routes/adminRoute");
const { errorMiddleware } = require("./src/middlewares/errorMiddleware");
const { categoryRouter } = require("./src/routes/categoryRoute");
const { assetRouter } = require("./src/routes/assetRoute");
const { assetRequestRouter } = require("./src/routes/assetRequestRoute");

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.resolve('./')));


//Api Routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/asset", assetRouter)
app.use("/api/v1/asset-request", assetRequestRouter)


app.use(errorMiddleware)


app.listen(PORT, () => {
    console.log(`Server is running at http://localhoat:${PORT}`)
})