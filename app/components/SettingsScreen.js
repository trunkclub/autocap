import React, { Component } from 'react'
import { Link } from 'react-router'
import styles from './SettingsScreen.css'
import AutocapLogo from './AutocapLogo'

const {ipcRenderer} = require('electron')

export default class SettingsScreen extends Component {
  state = { filePath: '' }

  componentDidMount() {
    ipcRenderer.send('get-default-file-path')
    ipcRenderer.on('get-default-file-path-reply', this.setFilePath)
  }

  setFilePath = (evt, filePath) => {
    this.setState({
      filePath: filePath
    })
  }

  handleValueChange = (evt) => {
    ipcRenderer.send('set-file-path', evt.target.value)
    this.setState({
      filePath: evt.target.value
    })
  }

  handleKeyPress(evt) {
    if (evt.key === 'Escape' || evt.key === 'Enter') {
      evt.target.blur()
    }
  }

  render() {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.topHalfContainer}>
           <div className={styles.topHalfTitle}>
            <AutocapLogo />
           </div>
        </div>
        <div className={styles.bottomHalfContainer}>
          <div className={styles.optionsContainer}>
            <div>
              <table>
                <tbody>
                  <tr>
                    <th >File Path</th>:
                    <td >
                      <input
                        ref="input"
                        type="text"
                        placeholder="--"
                        value={this.state.filePath}
                        onKeyUp={this.handleKeyPress.bind(this)}
                        onChange={this.handleValueChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            <Link to="/">
              <button type="button" className={styles.tcButton}>
                Go Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
