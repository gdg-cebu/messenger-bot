const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const logger = require('./config/logger');
const config = require('./config/config');

const handlers = require('./lib/handlers');


const app = express();

app.use(morgan('dev'));
app.use(bodyparser.json());

app.use('/static', express.static(path.join(__dirname, 'static')));


/**
 *  The route for handling webhook verification requests. To verify our
 *  webhook, we have to respond with the `hub.challenge` value which is sent in
 *  the verification request, but we only do that if `hub.verify_token` is the
 *  same value that we set when we created the Facebook App. Otherwise, we send
 *  a 403 Forbidden response.
 **/

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


/**
 *  The route which will handle actual messaging callbacks from the Messenger
 *  Platform. POST data will be sent to this route whenever messaging event
 *  happens in a page that our Facebook App is subscribed to (e.g. someone
 *  sent a message to our Facebook Page, etc.)
 **/

app.post('/webhook', (req, res) => {
    var data = req.body;

    if (data.object === 'page') {
        // Each item in `data.entry` corresponds to a Facebook Page that our
        // Facebook App is subscribed to for messaging events. It is possible
        // that we get messaging events from multiple Facebook Pages at once
        // when the Messenger Platform sends them by batches.
        data.entry.forEach(page => {
            // Each item in `page.messaging` corresponds to a messaging event
            // that happened to the Facebook Page that we are subscribed to
            // (e.g. a message sent to the page, our reply has been delivered,
            // etc.). Each messaging event has it's own data format, and we
            // handle each one of them separately.
            page.messaging.forEach(messaging => {
                if (messaging.message && !messaging.message.is_echo) {
                    handlers.messageReceived(messaging);
                } else if (messaging.postback) {
                    handlers.postbackReceived(messaging);
                } else if (messaging.optin) {
                    handlers.authentication(messaging);
                } else if (messaging.account_linking) {
                    handlers.accountLinking(messaging);
                } else if (messaging.delivery) {
                    handlers.messageDelivered(messaging);
                } else if (messaging.read) {
                    handlers.messageRead(messaging);
                } else if (messaging.message && messaging.message.is_echo) {
                    handlers.messageEcho(messaging);
                }
            });
        });
    }

    // We need to send back 200 OK within 20 seconds to let the Messenger
    // Platform know that we have received and handled the request. Otherwise,
    // the request will time out.
    res.sendStatus(200);
});


module.exports = app;
