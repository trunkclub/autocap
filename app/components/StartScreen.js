// @flow
import React, { Component } from 'react'
import { Link } from 'react-router'
import styles from './StartScreen.css'
import Gallery from 'react-grid-gallery'
import {ipcRenderer} from 'electron'
import TrunkshotLogo from './TrunkshotLogo'

// this is where the view sends to messages to the
// electron process.
const onStartButtonClick = () => {
  ipcRenderer.send('start-recording', 'start')
}

const onStopButtonClick = () => {
  // this is where the view responds to messages sent by the
  // electron process.
  ipcRenderer.send('stop-recording', 'stop')
}

export default class StartScreen extends Component {

  constructor() {
    super()
    this.state = {}
    this.onSelectImage = this.handleSelectImage.bind(this)
    this.onExportButtonClick = this.onExportButtonClick.bind(this)
  }

  componentDidMount() {
    ipcRenderer.on('stop-recording-reply', this.handleStopRecordingReply)
  }

  onExportButtonClick() {
    if (!this.state.images) { return }
    const selectedSrcs = this.state.images.filter(i => i.isSelected ).map((i) => i.src)
    ipcRenderer.send('export-pdf', selectedSrcs)
  }

  handleSelectImage = (index, image) => {
    const images = this.state.images
    const img = images[index]
    if (img.hasOwnProperty('isSelected'))
      img.isSelected = !img.isSelected
    else
        img.isSelected = true
    images[index] = img
    this.setState({
      images: images
    })
  }

  handleStopRecordingReply = (evt, args) => {
    const images = args.map((a) => {
      return {
        src: a,
        thumbnail: a,
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        isSelected: true
      }
    })
    this.setState({images})
  }

  renderImages() {
    if (this.state.images) {
      return (

    <div className={styles.galleryContainer}>
      <Gallery
        images={this.state.images}
        onSelectImage={this.handleSelectImage}
      />
    </div>
      )
    }
    return (
       <div className={styles.topHalfContainer}>
          <div className={styles.topHalfTitle}>
           <TrunkshotLogo />
          </div>
         <div className={styles.topHalfText}>
           Capture your processes with one click
         </div>
       </div>
   )
  }

  render() {
    return (
      <div className={styles.pageContainer}>
        {this.renderImages()}
        <div className={styles.bottomHalfContainer}>
          <div className={styles.buttonsContainer}>
            <button
              type="button"
              className={styles.tcButton}
              onClick={onStartButtonClick}
            >
              <span className={styles.symbols}>▶︎ </span>
              Start
            </button>

            <button
              type="button"
              onClick={onStopButtonClick}
              className={styles.tcButton}
            >
            <span className={styles.stopSymbol}>■ </span>
             Stop
            </button>

            <button
              type="button"
              onClick={this.onExportButtonClick}
              className={styles.tcButton}
            >
              Export
            </button>

          </div>
          <div className={styles.settingsContainer}>
            <Link className={styles.settingSymbol} to="/settings">
              ⚙
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
