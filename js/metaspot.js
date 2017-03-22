import React from 'react'
import ReactDOM, { render } from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import reducer from './reducer'
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'

import App from './components/App'
import About from './components/About'

import css from '../styles.less'

export const store = createStore(
  combineReducers({
    reducer
  })
)

document.addEventListener("DOMContentLoaded", () => {
  let container = document.body
  let paths
  
  window.metaspot = {
    browserHistory,
    container
  }
  
  if (location.href.indexOf('index.html') > -1) {
    paths = {
      root: '/citronil/metaspot',
      app: 'index.html'
    }  
  } else {
    paths = {
      root: '/',
      app: 'metaspot'
    }
  }
  
  render((
    <Provider store={ store }>
      <Router history={ browserHistory }>
        <Route path={ paths.root }>
          <Route path={ paths.app }>
            <IndexRoute component={ App } />
            <Route path="about" component={ About }>
            </Route>
          </Route>
        </Route>
      </Router>
    </Provider>
  ), container)  
})
