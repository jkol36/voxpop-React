import React, { Component } from "react"
import { Header, Segment } from "semantic-ui-react"
import "./Updates.css"

class Updates extends Component {
  state = { offset: 0, limit: 5 }

  render() {
    return (
      <React.Fragment>
        <div className="update-content">
          <Header className="textFont" textAlign="center" size="huge" inverted>
            News & Updates
          </Header>
        </div>
        <Segment style={{ margin: "0px" }}>
          <Header as="h4" textAlign="center">
            No new updates...
          </Header>
        </Segment>
      </React.Fragment>
    )
  }
}

export default Updates
