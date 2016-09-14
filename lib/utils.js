const messenger = require('./messenger');
const database = require('./database');


/**
 *  Send upcoming events to the given user.
 *
 *  @param {String} recipient: the id of the user to send the message to.
 **/

function sendUpcomingEvents(recipient) {
    return database.getUpcomingEvents().then(events => {
        return events.slice(0, 10).map(event => {
            return {
                title: event.name,
                subtitle: `${event.date} at ${event.venue}`,
                image_url: `https://gdgcebu.org/static/images/${event.thumbnail}`
            };
        });
    }).then(events => {
        if (events.length > 0) {
            const text = 'Here are our upcoming events:';
            return messenger.sendTextMessage(recipient, text).then(_ => {
                return messenger.sendGenericTemplate(recipient, events);
            });
        } else {
            const text = 'We don\'t have any upcoming events at the moment.';
            return messenger.sendTextMessage(recipient, text);
        }
    });
}


exports.sendUpcomingEvents = sendUpcomingEvents;
