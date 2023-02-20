import AV from 'leanengine'
import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'

/**
 * Loads all cloud functions under the `functions` directory.
 */
fs.readdirSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'functions')).forEach( async file => {
  try {
    await import(path.join(path.dirname(fileURLToPath(import.meta.url)), 'functions', file))
  } catch (err) {
    if (err.code !== 'ERR_UNKNOWN_FILE_EXTENSION') { // Ignore files like .gitkeep or .DS_Store
      throw err
    }
  }
})

/**
 * A simple cloud function.
 */
AV.Cloud.define('hello', function(request) {
  return 'Hello world!'
})
