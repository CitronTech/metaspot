import React from 'react'
import ReactDOM, { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import App from './components/App'
import About from './components/About'

class Metaspot extends React.Component {
  render () {
    return (
      <div></div>
    )
  }
}

if (typeof window === 'object') {
  window.metaspot = new function() {
    let it = this
    
    it.render = function (opts) {
      if (opts.container) {
        it.container = opts.container
        
        console.log('router')
        
        render((
          <Router history={ browserHistory }>
            <Route path="/" component={ App }>
            </Route>
          </Router>
        ), it.container)  
      }
    }
  }
}
