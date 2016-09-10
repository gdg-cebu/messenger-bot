const logger = require('../../config/logger');
const messenger = require('../messenger');


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
        handleThankYouMessage
    ];

    let index = 0;
    const next = _ => {
        if (++index < messageHandlers.length) {
            messageHandlers(recipient, message, next);
        }
    };

    messageHandlers[0](recipient, message, next);
}


/** Respond to messages saying "thank you" (and several variations). **/

function handleThankYouMessage(recipient, message, next) {
    const pattern = /(thank you|thanks|tnx|thnx|salamat)/gi;
    if (pattern.test(message.text)) {
        return messenger.sendTextMessage(recipient, 'Sure, no problem! :)');
    }
    next();
}


module.exports = messageReceived;
