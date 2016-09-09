const winston = require('winston');


const logger = new winston.Logger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: 'debug',
            filename: 'logs/messenger-bot.log',
            json: false,
            maxsize: 10000
        })
    ]
});


module.exports = logger;
