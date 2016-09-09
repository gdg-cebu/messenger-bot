const firebase = require('firebase');
const config = require('../config/config');


firebase.initializeApp({
    databaseURL: config.get('FIREBASE_DATABASE_URL')
});

const database = firebase.database();


function fetchEvents() {
    return new Promise((resolve, reject) => {
        database.ref('events').once('value', data => resolve(data.val()));
    });
}


function upcomingEvents() {
    const now = (new Date()).valueOf();
    return fetchEvents().then(events => events.filter(event => {
        const date = new Date(event.date);
        return date.valueOf() > now;
    }));
}


exports.upcomingEvents = upcomingEvents;
