import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'

import { TwoSections } from 'zest'
import Logo from './RocketLogo'

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
    let header = (
      <div className="header">
        <div className="logo">
          METASP
          <div className="logo-icon">
            <div aria-hidden="true" className="li_vynil"></div>
          </div>
          T
        </div>    
      </div>
    )
    
    return (
      <TwoSections>
        <div className="sidebar">
          { header }
        </div>
        <div className="body" style={{ padding: '20px', background: '#FFF' }}>
          I am the app.
          <Logo />
        </div>
      </TwoSections>
    )
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer