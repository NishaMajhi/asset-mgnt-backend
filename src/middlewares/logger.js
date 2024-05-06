const winston = require('winston');

const logLevels = {
    error: 'error',
    warn: 'warn',
    info: 'info',
    http: 'http',
    debug: 'debug',
};


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [

        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),

        new winston.transports.File({
            filename: 'app.log',
            level: 'error',
        }),
    ],
});


// logger.add(new winston.transports.Http({
//     host: 'example.com',
//     port: 8080,
// }));

module.exports = logger;
