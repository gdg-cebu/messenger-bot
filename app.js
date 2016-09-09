const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const logger = require('./config/logger');
const config = require('./config/config');


const app = express();

app.use(morgan('dev'));
app.use(bodyparser.json());


app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe'
    && req.query['hub.verify_token'] === config.get('FB_VERIFY_TOKEN')) {
        logger.info('Webhook validation successful.');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        logger.error('Webhook validation failed.');
        res.sendStatus(403);
    }
});


module.exports = app;
