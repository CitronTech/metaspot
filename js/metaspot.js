import React from 'react'
import ReactDOM, { render } from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import Reducer from './reducer'
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'
import App from './components/App'
import About from './components/About'
import css from '../styles.less'

export const store = createStore(
  combineReducers({
    Reducer
  })
)

if (typeof window === 'object') {
  window.metaspot = new function() {
    let it = this
    
    it.render = function (opts) {
      if (opts.container) {
        it.container = opts.container
        it.browserHistory = browserHistory
        
        render((
          <Provider store={ store }>
            <Router history={ browserHistory }>
              <Route path="/">
                <Route path="metaspot">
                  <IndexRoute component={ App } />
                  <Route path="about" component={ About }>
                  </Route>
                </Route>
              </Route>
            </Router>
          </Provider>
        ), it.container)  
      }
    }
  }
}
