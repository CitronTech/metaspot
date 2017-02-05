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
      <div>
        <div>I am App.</div>
        <Panel />
      </div>
    )
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer