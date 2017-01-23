import fs from 'fs'
import temp from 'temp'
import resemble from 'node-resemble-js'
import {nativeImage} from 'electron'
import ScreenshotUtils from './ScreenshotUtils'

module.exports = class ScreenshotControls {
  constructor(threshold=1.0) {
    this.keptImages = []
    this.shouldStop = false
    this.isStarted = false
    this.threshold = threshold
  }

  destroy() {
    this.deleteScreenshots(this.keptImages)
  }

  takeScreenshot(callback) {
    const tempName = temp.path({prefix: `${new Date().getTime()}`, suffix: '.png'})
    ScreenshotUtils.screenshot(tempName, callback)
  }

  diffScreenshots(image, other_image, callback) {
    resemble(image).compareTo(other_image).onComplete(callback)
  }

  deleteScreenshot(image) {
    fs.unlinkSync(image)
  }

  deleteScreenshots(images) {
    images.map((image) => this.deleteScreenshot(image))
  }

  screenshotLoop() {
    this.takeScreenshot((err, imagePath) => {
      // var length = this.allImages.push(imagePath)
      if (this.keptImages.length === 0) {
        this.resizeScreenshot(imagePath, (outImage) => {
          this.keptImages.push(outImage)
          this.deleteScreenshot(imagePath)
          this.screenshotLoop()
        })
      } else {
        const lastKeptImage = this.keptImages[this.keptImages.length-1]
        this.resizeScreenshot(imagePath, (outImage) => {
          this.deleteScreenshot(imagePath)
          this.diffScreenshots(lastKeptImage, outImage, (data) => {
            const misMatchPercentage = parseFloat(data.misMatchPercentage)
            console.log(misMatchPercentage)
            if (misMatchPercentage >= this.threshold) {
              this.keptImages.push(outImage)
            } else {
              this.deleteScreenshot(outImage)
            }
            if (!this.shouldStop) {
              this.screenshotLoop()
            }
          })
        })
      }
    })
  }

  startScreenshotLoop(threshold=this.threshold) {
    if (!this.isStarted) {
      this.shouldStop = false
      this.isStarted = true
      this.threshold = threshold
      this.screenshotLoop()
    }
  }

  stopScreenshotLoop(callback) {
    this.shouldStop = true
    this.isStarted = false
  }

  resize(image, maxWidth, replacement, callback) {
    const inFile = nativeImage.createFromPath(image)
    const outFileName = image.replace(/\.png$/i, replacement)
    const inSize = inFile.getSize()
    const scaleRatio = maxWidth / inSize.width
    const scaleWidth = inSize.width * scaleRatio
    const scaleHeight = inSize.height * scaleRatio
    const resizedImage = inFile.resize({
      width: scaleWidth,
      height: scaleHeight
    })
    const buffer = resizedImage.toJPEG(100)
    fs.writeFile(outFileName, buffer, (err) => {
      if (err) throw err
      callback(outFileName)
    })
  }

  resizeScreenshot(image, callback) {
    this.resize(image, 1024, '.jpg', callback)
  }
}
