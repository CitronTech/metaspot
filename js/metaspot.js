import React from 'react'
import ReactDOM from 'react-dom'
import { combineReducers, createStore } from 'redux'

class Metaspot extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  
  render () {
    return (
      <div>
        Hello world. I am Metaspot.
      </div>
    )
  }
}

if (typeof window === 'object') {
  window.metaspot = new function() {
    let it = this
    
    it.render = function (opts) {
      if (opts.container) {
        it.container = opts.container
        ReactDOM.render(<Metaspot />, it.container)  
      }
    }
  }
}
