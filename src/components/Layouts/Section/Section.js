import React, { Component, Fragment } from "react"
import { Segment, Header } from "semantic-ui-react"
import "./Section.css"

class Section extends Component {
  render = () => {
    return (
      <Fragment>
        <Header className="module-header" inverted attached="top" as="h4">
          {this.props.title}
        </Header>
        <Segment attached style={{ minHeight: "100px" }}>
          {this.props.children}
        </Segment>
      </Fragment>
    )
  }
}

export default Section
