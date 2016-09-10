const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');


const app = express();

app.use(morgan('dev'));
app.use(bodyparser.json());

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/webhook', require('./webhook'));


module.exports = app;
