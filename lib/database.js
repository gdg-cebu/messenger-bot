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
        database.ref('events').once('value', data => resolve(data.val()));
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


exports.getUpcomingEvents = getUpcomingEvents;
