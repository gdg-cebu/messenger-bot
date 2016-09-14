const firebase = require('firebase');
const config = require('../config/config');


// Use Firebase as our database backend.
firebase.initializeApp({
    databaseURL: config.get('FIREBASE_DATABASE_URL')
});

const database = firebase.database();


/**
 *  Fetch all events from Firebase. Events are located at the `events`
 *  reference.
 *
 *  @return A Promise which will resolve to the array of events fetched from
 *      the Firebase reference.
 **/

function fetchEvents() {
    return new Promise((resolve, reject) => {
        database.ref('events')
            .once('value', data => resolve(data.val() || []));
    });
}


/**
 *  Get those events whose dates are still in the future.
 *
 *  @return A Promise which will resolve to the array of events whose dates are
 *      still in the future.
 **/

function getUpcomingEvents() {
    const now = (new Date()).valueOf();
    return fetchEvents().then(events => events.filter(event => {
        const date = new Date(event.date);
        return date.valueOf() > now;
    }));
}


/**
 *  Fetch messenger responses from Firebase. Messenger responses are located at
 *  the `messenger/responses` reference.
 *
 *  @return A Promise which will resolve to an object of messenger request-
 *      response pairs from the Firebase reference.
 **/

function getMessengerResponses() {
    return new Promise((resolve, reject) => {
        database.ref('messenger/responses')
            .once('value', data => resolve(data.val() || {}))
    });
}


exports.getUpcomingEvents = getUpcomingEvents;
exports.getMessengerResponses = getMessengerResponses;
