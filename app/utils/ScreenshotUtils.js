import {exec} from 'child_process'
import os from 'os'
import fs from 'fs'
import util from 'util'
import path from 'path'

const devNircmdc = path.join(__dirname, '/../bin/nircmdc.exe')
const packagedNircmdc = path.join(__dirname, '/../app.asar.unpacked/bin/nircmdc.exe')
const nircmdc = __dirname.includes('app.asar') ? packagedNircmdc : devNircmdc

export default {

// from https://github.com/uiureo/node-screencapture/commit/5ff88988e99db4afc31333fd8719d76a9f15559d
  getCommand (path, platform) {
    switch (platform) {
      case 'freebsd':
        return `scrot -s ${path}`
      case 'darwin':
        return `screencapture -x ${path}`
      case 'linux':
        return `import ${path}`
      case 'win32':
        return `${nircmdc} savescreenshot ${path}`
      default:
        throw new Error('unsupported platform')
    }
  },

  captureFunction(filePath, callback) {
    exec(this.getCommand(filePath, os.platform()), function (err) {
      // nircmd always exits with err even though it works
      if (err && os.platform() !== 'win32') callback(err)

      fs.exists(filePath, function (exists) {
        // check exists for success/fail as well (or instead on windows)
        if (!exists) {
          return callback(new Error('Screenshot failed'))
        }
        callback(null, filePath)
      })
    })
  },

  screenshot(imagePath, callback) {
    this.captureFunction(imagePath, function(err, imagePath) {
      callback(err, imagePath)
    })
  },

}
