const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
require('fs').mkdirSync(logsDir, { recursive: true });

// Create Winston logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'spam-highlighter' },
    transports: [
        // Write all logs with level 'error' and below to error.log
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write all logs with level 'info' and below to combined.log
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write API specific logs to api.log
        new winston.transports.File({
            filename: path.join(logsDir, 'api.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Create API logger function
const logAPICall = (req, res, duration, error = null) => {
    const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        requestBody: req.body,
        responseStatus: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('user-agent'),
        ip: req.ip,
        error: error ? {
            message: error.message,
            stack: error.stack
        } : null
    };

    if (error) {
        logger.error('API Error', logData);
    } else {
        logger.info('API Call', logData);
    }
};

// Middleware for logging API calls
const apiLogger = (req, res, next) => {
    const start = Date.now();
    
    // Once the request is finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        logAPICall(req, res, duration);
    });

    // If there's an error
    res.on('error', (error) => {
        const duration = Date.now() - start;
        logAPICall(req, res, duration, error);
    });

    next();
};

module.exports = {
    logger,
    apiLogger,
    logAPICall
};
