/* eslint-disable func-names */
import { expect } from 'chai';
import ScreenshotUtils from '../app/utils/ScreenshotUtils'

describe('ScreenshotUtils', () => {
  it('it builds a MacOS capture command', () => {
    expect(ScreenshotUtils.getCommand('/Users/Trunkshot/1234.jpg', 'darwin')).to.equal(`screencapture -x /Users/Trunkshot/1234.jpg`)
  })

  it('it builds a FreeBSD capture command', () => {
    expect(ScreenshotUtils.getCommand('/Users/Trunkshot/1234.jpg', 'freebsd')).to.equal(`scrot -s /Users/Trunkshot/1234.jpg`)
  })

  it('it builds a Linux capture command', () => {
    expect(ScreenshotUtils.getCommand('/Users/Trunkshot/1234.jpg', 'linux')).to.equal(`import /Users/Trunkshot/1234.jpg`)
  })

  // #TODO Once windows support is added this test will need to go back
  // it('it builds a Windows capture command', () => {
  //   expect(ScreenshotUtils.getCommand('/Users/Trunkshot/1234.jpg', 'win32')).to.equal(`screencapture -x /Users/Trunkshot/1234.jpg`)
  // })

})
