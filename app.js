const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');


const app = express();

app.use(morgan('dev'));
app.use(bodyparser.json());


module.exports = app;
