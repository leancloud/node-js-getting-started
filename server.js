'use strict'

import AV from 'leanengine'

AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
})

// Comment the following line if you do not want to use masterKey.
AV.Cloud.useMasterKey()

import app from './app.js'

// Retrieves the port number from environment variable `LEANCLOUD_APP_PORT`.
// LeanEngine runtime will assign a port and set the environment variable automatically.
const PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000)

app.listen(PORT, (err) => {
  console.log('Node app is running on port:', PORT)

  // Registers a global exception handler for uncaught exceptions.
  process.on('uncaughtException', err => {
    console.error('Caught exception:', err.stack)
  });
  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack)
  })
})
