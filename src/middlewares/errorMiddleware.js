const errorMiddleware = (err, req, res, next) => {
    const statusCode = res.statusCode
    if (statusCode !== 200 && statusCode !== 201) {
        res.status(statusCode)
        res.json({
            status: false,
            error: err.message
        })
    }
}

module.exports = {
    errorMiddleware
}