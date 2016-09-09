const logger = require('../../config/logger');
const messenger = require('../messenger');


/**
 *  Handle "Postback Received" callbacks. We receive these callbacks if we
 *  subscribed to "messaging_postbacks" events when we created our Facebook
 *  App. For more information about the format of `data`, check out the
 *  documentation at https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 **/

function postbackReceived(data) {
    logger.info('Processing "Postback Received" callback');
    logger.debug(data);

    const sender = data.sender.id;
    const payload = data.postback.payload;

    if (payload === 'get-started') {
        sendGetStartedResponse(sender);
    }
}


/** Respond to "get-started" postback payloads. **/

function sendGetStartedResponse(recipient) {
    const text = 'Good day! What can we do for you?';
    return messenger.sendButtonTemplate(recipient, text, [
        {
            type: 'web_url',
            title: 'Visit Website',
            url: 'https://gdgcebu.org/'
        },
        {
            type: 'postback',
            title: 'Show Upcoming Events',
            payload: 'upcoming-events'
        }
    ])
}


module.exports = postbackReceived;
