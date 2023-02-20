'use strict'

const express = require('express')
const timeout = require('connect-timeout')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const AV = require('leanengine')

// Loads cloud function definitions.
// You can split them into several files, but don't forget to load them into the main file.
require('./cloud')

const app = express()

// Configures template engine.
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Configures default timeout.
app.use(timeout('15s'))

// Loads LeanEngine middleware.
app.use(AV.express())

app.enable('trust proxy')
// Uncomment the following line to redirect all HTTP requests to HTTPS.
// app.use(AV.Cloud.HttpsRedirect())

app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.header('Cache-Control', 'no-cache')
  res.render('index', { currentTime: new Date() })
})

// You can put routings in multiple files according to their categories.
app.use('/todos', require('./routes/todos'))

app.use((req, res, next) => {
  // If there is no routing answering, throw a 404 exception to exception handlers.
  if (!res.headersSent) {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  }
})

// error handler
app.use((err, req, res, next) => {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // Ignores websocket timeout.
    return
  }

  const statusCode = err.status || 500
  if (statusCode === 500) {
    console.error(err.stack || err)
  }
  if (req.timedout) {
    console.error('Request timeout: url=%s, timeout=%d, please check whether its execution time is too long, or the response callback is invalid.', req.originalUrl, err.timeout)
  }
  res.status(statusCode)
  // Do not output exception details by default.
  let error = {}
  if (app.get('env') === 'development') {
    // Displays exception stack on page if running in the development enviroment.
    error = err
  }
  res.render('error', {
    message: err.message,
    error: error
  })
})

module.exports = app
