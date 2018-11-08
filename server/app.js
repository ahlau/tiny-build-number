// app.js
//
// Application specific libraries here
// Extracted out from server.js so that we can isolate this for testing without
// starting up a server and conflicting with our test environment

const config = require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api_router');
const cors = require('cors');

var app = express();
var {mongoose} = require('./db/mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.static('server/public'));
app.use('/api', apiRouter);

module.exports = { app };
