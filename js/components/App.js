import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'

import { Panel } from 'zest'

const mapStateToProps = (state) => {
  return {
    
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onReady: function () {
      
    }
  }
}

class App extends Component {
  render () {
    return (
      <div class="top fill">
        <div class="sidebar">
          <div class="header">
            <div class="logo">
              METASP<div class="logo-icon"><div aria-hidden="true" class="li_vynil"></div></div>T
            </div>    
          </div>
        </div>
        
        <div class="body"></div>
      </div>
    )
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer