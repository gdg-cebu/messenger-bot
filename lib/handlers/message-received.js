const logger = require('../../config/logger');
const messenger = require('../messenger');
const database = require('../database');
const utils = require('../utils');


/**
 *  Handle "Message Received" callbacks. We receive these callbacks if we
 *  subscribed to "messages" events when we created our Facebook App. For more
 *  information about the format of the `data`, check out the documentation at
 *  https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 **/

function messageReceived(data) {
    logger.info('Processing "Message Received" callback');
    logger.debug(data);

    const sender = data.sender.id;
    const { text, attachments } = data.message;

    return messageResponsePipeline(sender, data.message);
}


/**
 *  Run the received message through a series of message handler functions
 *  until one of them responds to the message.
 **/

function messageResponsePipeline(recipient, message) {
    const messageHandlers = [
        checkFixedMessengerResponses,
        handleUpcomingEventsInquiry
    ];

    let index = 0;
    const next = _ => {
        if (++index < messageHandlers.length) {
            messageHandlers[index](recipient, message, next);
        }
    };

    messageHandlers[0](recipient, message, next);
}


/**
 *  Check if there is a fixed messenger response for the message received
 *  stored in the database. Fixed messenger responses are simple text messages
 *  that are sent in response to messages that match certain patterns.
 **/

function checkFixedMessengerResponses(recipient, message, next) {
    database.getMessageResponses().then(responses => {
        for (let key in responses) {
            const pattern = new RegExp(key, 'gi');
            if (pattern.test(message.text)) {
                return messenger.sendTextMessage(recipient, responses[key]);
            }
        }
        throw new Error('No messenger response found for that message.');
    }).catch(_ => next());
}


/** Respond to messages that inquire about upcoming events. **/

function handleUpcomingEventsInquiry(recipient, message, next) {
    const pattern = /(next|upcoming|future).*?((GDG|Google)|events?)/gi;
    if (pattern.test(message.text)) {
        return utils.sendUpcomingEvents(recipient);
    }
    next();
}


module.exports = messageReceived;
