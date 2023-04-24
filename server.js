//set environment variables
const dotenv = require('dotenv'); //must be the first 2 lines of code
dotenv.config({path: './config.env'});
const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

//Body-parser is a middleware that parses incoming requests with JSON payloads and is based on body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

//Path module provides utilities for working with file and directory paths
const path = require('path');

//debugging and logging
const morgan = require('morgan-body');

//middleware
//create a write stream (in append mode)
var rfs = require('rotating-file-stream'); // version 2.x

//serve static files
//create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', //rotate daily
    path: path.join(__dirname, 'log'), //log directory will log all data here
})

//setup the logger
morgan(app, {
    stream: accessLogStream,
    noColors: true,
    logReqUserAgent: true,
    logRequestBody: true,
    logResponseBody: true,
    logReqCookies: true,
    logReqSignedCookies: true
});

//__dirname is the directory name of the current module
app.use(express.static(path.join(__dirname, 'public')));

//set the view engine to ejs
app.set('view engine', 'ejs');

//set the views directory
app.set('views', 'views');

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/signup', (req, res) => {
    res.status(200).render('login', {pageTitle: 'Login Form'});
});

https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
});