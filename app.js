'use strict';

var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AV = require('leanengine');

// Loads cloud function definitions.
// You can split it into multiple files but do not forget to load them in the main file.
require('./cloud');

var app = express();

// Configures template engine.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configures default timeout.
app.use(timeout('15s'));

// Loads LeanEngine middleware.
app.use(AV.express());

app.enable('trust proxy');
// Uncomment the following line to redirect all HTTP requests to HTTPS.
// app.use(AV.Cloud.HttpsRedirect());

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', function(req, res) {
  res.render('index', { currentTime: new Date() });
});

// You can store routings in multiple files according to their categories.
app.use('/todos', require('./routes/todos'));

app.use(function(req, res, next) {
  // If there is no routing answering, throw a 404 exception to exception handlers.
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, next) {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // Ignores websocket timeout.
    return;
  }

  var statusCode = err.status || 500;
  if (statusCode === 500) {
    console.error(err.stack || err);
  }
  if (req.timedout) {
    console.error('Request timeout: url=%s, timeout=%d, please check whether its execution time is too long, or the response callback is invalid.', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // Do not output exception details by default.
  var error = {};
  if (app.get('env') === 'development') {
    // Displays exception stack on page if running in the development enviroment.
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});

module.exports = app;
