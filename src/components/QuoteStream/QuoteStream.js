import React, { Component } from "react"
import { Segment, Header } from "semantic-ui-react"

class QuoteStream extends Component {
  render = () => {
    return (
      <Segment>
        <Header as="h1" style={{ fontSize: 24 }}>
          Quote Stream
        </Header>
      </Segment>
    )
  }
}

export default QuoteStream
