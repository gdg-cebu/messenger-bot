#!/usr/bin/env node
const config = require('../config/config');
const logger = require('../config/logger');
const messenger = require('../lib/messenger');


const greetingText = config.get('GDG_CEBU_DESCRIPTION');
const getStartedButtonPayload = 'get-started';
const persistentMenuItems = [
    {
        type: 'web_url',
        title: 'Visit Website',
        url: 'https://gdgcebu.org/'
    },
    {
        type: 'postback',
        title: 'See Upcoming Events',
        payload: 'upcoming-events'
    }
];


logger.info('Setting thread settings: Greeting Text');
messenger.setGreetingText(greetingText);

logger.info('Setting thread settings: Get Started Button');
messenger.setGetStartedButton(getStartedButtonPayload);

logger.info('Setting thread settings: Persistent Menu');
messenger.setPersistentMenu(persistentMenuItems);
