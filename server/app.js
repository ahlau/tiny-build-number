const config = require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api_router');

var app = express();
var {mongoose} = require('./db/mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', apiRouter);

module.exports = { app };