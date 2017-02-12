import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'

import { TwoSections } from 'zest'

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
      <div class="header">
        <div class="logo">
          METASP
          <div class="logo-icon">
            <div aria-hidden="true" class="li_vynil"></div>
          </div>
          T
        </div>    
      </div>
    )
    
    return (
      <TwoSections>
        <div class="sidebar">
          { header }
        </div>
        <div class="body">
        
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