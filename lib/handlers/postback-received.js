const logger = require('../../config/logger');
const messenger = require('../messenger');
const schedules = require('../schedules');


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
    } else if (payload === 'upcoming-events') {
        sendUpcomingEventsResponse(sender);
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
    ]);
}


/** Respond to "upcoming-events" postback payloads. **/

function sendUpcomingEventsResponse(recipient) {
    return messenger.setSenderAction(recipient, 'typing_on').then(_ => {
        return schedules.upcomingEvents();
    }).then(events => {
        return events.slice(0, 10).map(event => {
            return {
                title: event.name,
                subtitle: event.description.substring(0, 80),
                image_url: `https://gdgcebu.org/static/images/${event.thumbnail}`
            };
        });
    }).then(events => {
        return messenger.sendTextMessage('Here are our upcoming events:').then(_ => {
            messenger.sendGenericTemplate(events);
        });
    });
}


module.exports = postbackReceived;
