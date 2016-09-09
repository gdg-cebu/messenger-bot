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
}


module.exports = messageReceived;
