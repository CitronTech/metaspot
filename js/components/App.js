import React from 'react'

class App extends React.Component {
  render () {
    console.log('app render')
    
    return (
      <div>
        <div>I am App.</div>
        { this.props.children }
      </div>
    )
  }
}

export default App