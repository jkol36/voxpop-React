import React, { Component } from "react"
import { Message } from "semantic-ui-react"

class ErrorBoundary extends Component {
  state = { hasError: false }

  componentDidCatch = (error, info) => {
    this.setState({ hasError: true })
  }

  render = () => {
    if (this.state.hasError) {
      return (
        <Message negative>
          <Message.Header>
            Something went wrong in the server, try refreshing the page
          </Message.Header>
        </Message>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
