// @flow
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import './app.global.css'
import App from './containers/App'
import SettingsScreen from './components/SettingsScreen'

render(
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="/settings" component={SettingsScreen}/>
  </Router>,
  document.getElementById('root')
)
