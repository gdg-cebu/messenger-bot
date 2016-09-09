const request = require('request');
const config = require('../config/config');


/**
 *  Send a text message to the Messenger Platform. This simply formats the
 *  message data properly to match what is expected by the Messenger Platform.
 *
 *  @param {String} recipientId: the id of the user to send the message to.
 *  @param {Object} text: the text to be sent to the Messenger Platform.
 **/

function sendTextMessage(recipientId, text) {
    const data = {
        recipient: {
            id: recipientId
        },
        message: { text }
    };
    return sendToMessenger(data);
}


/**
 *  Send a message with attachment to the Messenger Platform. This simply
 *  formats the message data properly to match what is expected by the
 *  Messenger Platform.
 *
 *  @param {String} recipientId: the id of the user to send the message to.
 *  @param {Object} attachment: a single attachment object to be sent to the
 *      Messenger Platform.
 **/

function sendAttachment(recipientId, attachment) {
    const data = {
        recipient: {
            id: recipientId
        },
        message: { attachment }
    };
    return sendToMessenger(data);
}


/**
 *  Set the typing indicator to let users know that we are already processing
 *  their request (these are called "Sender Actions").
 *
 *  @param {String} recipientId: the id of the user to send the message to.
 *  @param {String} state: the state to set the sender action to. Possible
 *      values are: "typing_on", "typing_off", and "mark_seen".
 **/

function sendSenderAction(recipientId, state) {
    const data = {
        recipient: {
            id: recipientId
        },
        sender_action: state
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


exports.sendTextMessage = sendTextMessage;
exports.sendAttachment = sendAttachment;
exports.sendSenderAction = sendSenderAction;
