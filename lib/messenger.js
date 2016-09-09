const request = require('request');
const config = require('../config/config');


/**
 *  Public API for sending messages to the Messenger Platform. What this does
 *  is simply format the message data properly to match what is expected by the
 *  Messenger Platform.
 *
 *  @param {String} recipientId: the id of the user to send the message to
 *  @param {Object} message: the message payload to be sent to the Messenger
 *      Platform. The format of this object depends on the kind of message we
 *      are trying to send. For more infomation about these formats, check out
 *      https://developers.facebook.com/docs/messenger-platform/send-api-reference
 **/

function send(recipientId, message) {
    const data = {
        recipient: {
            id: recipientId
        },
        message: message
    };
    return sendToMessenger(data);
}


/**
 *  Perform the actual sending of messages to the Messenger Platform by sending
 *  a POST request to the Send API endpoint, providing the message payload we
 *  want to send, as well as the access token of our Facebook Page.
 *
 *  @param {Object} data: the message payload to be sent to the Messenger
 *      Platform.
 **/

function sendToMessenger(data) {
    const requestData = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        method: 'POST',
        qs: { access_token: config.get('FB_PAGE_ACCESS_TOKEN') },
        json: data
    };

    return request(requestData, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const recipientId = body.recipient_id;
            const messageId = body.message_id;
            logger.info(`Message ${messageId} sent to recipient ${recipientId}`);
        } else {
            logger.error('Failed to send message.');
            logger.debug(response);
            logger.debug(body);
        }
    });
}


exports.send = send;
