const request = require('request');
const config = require('../config/config');
const logger = require('../config/logger');


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
    return sendMessageToMessenger(data);
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
    return sendMessageToMessenger(data);
}


/**
 *  Set the typing indicator to let users know that we are already processing
 *  their request (these are called "Sender Actions").
 *
 *  @param {String} recipientId: the id of the user to send the message to.
 *  @param {String} state: the state to set the sender action to. Possible
 *      values are: "typing_on", "typing_off", and "mark_seen".
 **/

function setSenderAction(recipientId, state) {
    const data = {
        recipient: {
            id: recipientId
        },
        sender_action: state
    };
    return sendMessageToMessenger(data);
}


/**
 *  Set the greeting text for conversations with our Facebook Page. Greeting
 *  texts are only visible on the first time the user interacts with our
 *  Facebook Page.
 *
 *  @param {String} text: the message to set the greeting text to.
 **/

function setGreetingText(text) {
    const settings = {
        setting_type: 'greeting',
        greeting: { text }
    };
    return setMessengerThreadSettings(settings);
}


/**
 *  Configure the Get Started button for conversations with our Facebook Page.
 *  The Get Started button is only visible on the first time the user interacts
 *  with our Facebook Page.
 *
 *  @param {String} payload: the payload to send back to our webhook when the
 *      Get Started button is clicked.
 **/

function setGetStartedButton(payload) {
    const settings = {
        setting_type: 'call_to_actions',
        thread_state: 'new_thread',
        call_to_actions: [ { payload } ]
    };
    return setMessengerThreadSettings(settings);
}


/**
 *  Configure the persistent menu for conversation threads with our Facebook
 *  Page. Menu items can send back a postback event to our webhook or open a
 *  web url.
 *
 *  @param {Array} actions: array of menu item objects configurations.
 **/

function setPersistentMenu(actions) {
    const settings = {
        setting_type: 'call_to_actions',
        thread_state: 'existing_thread',
        call_to_actions: actions
    };
    return setMessengerThreadSettings(settings);
}


/**
 *  Perform the actual sending of messages to the Messenger Platform by sending
 *  a POST request to the Send API endpoint, providing the message payload we
 *  want to send, as well as the access token of our Facebook Page.
 *
 *  @param {Object} data: the message payload to be sent to the Messenger
 *      Platform.
 **/

function sendMessageToMessenger(data) {
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


/**
 *  Set Messenger conversation thread settings by sending a POST request
 *  containing the desired settings to the Messenger Platform Thread Settings
 *  API endpoint.
 *
 *  @param {Object} settings: the thread settings to send to the API endpoint.
 *      To know more about the format of this object, check out
 *      https://developers.facebook.com/docs/messenger-platform/thread-settings
 **/

function setMessengerThreadSettings(settings) {
    const requestData = {
        url: 'https://graph.facebook.com/v2.6/me/thread_settings',
        method: 'POST',
        qs: { access_token: config.get('FB_PAGE_ACCESS_TOKEN') },
        json: settings
    };

    return request(requestData, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            logger.info('Thread settings successfully set.');
            logger.debug(body);
        } else {
            logger.error('Failed to set thread settings.');
            logger.debug(response);
            logger.debug(body);
        }
    });
}


exports.sendTextMessage = sendTextMessage;
exports.sendAttachment = sendAttachment;
exports.setSenderAction = setSenderAction;
exports.setGreetingText = setGreetingText;
exports.setGetStartedButton = setGetStartedButton;
exports.setPersistentMenu = setPersistentMenu;
