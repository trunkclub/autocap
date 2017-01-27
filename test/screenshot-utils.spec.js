/* eslint-disable func-names */
import { expect } from 'chai';
import ScreenshotUtils from '../app/utils/ScreenshotUtils'
import path from 'path'

describe('ScreenshotUtils', () => {
  const testNircmdc = path.join(__dirname, '/../app/bin/nircmdc.exe')

  it('it builds a MacOS capture command', () => {
    expect(ScreenshotUtils.getCommand('/Users/Autocap/1234.jpg', 'darwin')).to.equal('screencapture -x /Users/Autocap/1234.jpg')
  })

  it('it builds a FreeBSD capture command', () => {
    expect(ScreenshotUtils.getCommand('/Users/Autocap/1234.jpg', 'freebsd')).to.equal('scrot -s /Users/Autocap/1234.jpg')
  })

  it('it builds a Linux capture command', () => {
    expect(ScreenshotUtils.getCommand('/Users/Autocap/1234.jpg', 'linux')).to.equal('import /Users/Autocap/1234.jpg')
  })

  it('it builds a Windows capture command', () => {
    expect(ScreenshotUtils.getCommand('/Users/Autocap/1234.jpg', 'win32')).to.equal(`${testNircmdc} savescreenshot /Users/Autocap/1234.jpg`)
  })

})
