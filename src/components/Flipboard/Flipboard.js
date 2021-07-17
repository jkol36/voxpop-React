import React, { PureComponent, Fragment } from "react"
import { Header, Segment, List, Loader, Dimmer } from "semantic-ui-react"

import FlipCard from "./FlipCard"
import PropTypes from "prop-types"

import "./Flipboard.css"

const PAD_LENGTH = 19
const pad = (char, length, value, direction = "right") => {
  if (direction === "right") {
    return value + char.repeat(Math.max(char, length - value.length))
  } else {
    return char.repeat(Math.max(char, length - value.length)) + value
  }
}

class Flipboard extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    title: PropTypes.string
  }

  renderSegment = () => {
    const { data, loading } = this.props
    if (loading) {
      return (
        <Segment
          className="flipboard-segment"
          attached
          style={{ minHeight: "20vh" }}
        >
          <Dimmer active>
            <Loader size="huge" />
          </Dimmer>
        </Segment>
      )
    }
    return (
      <Segment className="flipboard-segment" attached>
        <List relaxed>
          {data &&
            data.map((item, index) => {
              let name = ""
              if (item.name.length > PAD_LENGTH) {
                name = item.name.substring(0, PAD_LENGTH)
              } else {
                name = pad(" ", PAD_LENGTH, item.name)
              }
              return (
                <div key={index} className="list-item">
                  <FlipCard
                    content={`${name.toUpperCase()}`}
                    width={22}
                    height={30}
                    fontSize={16}
                  />
                  <FlipCard
                    content={pad(" ", PAD_LENGTH, "SCORE: " + item.score)}
                    width={22}
                    height={30}
                    fontSize={16}
                  />
                </div>
              )
            })}
        </List>
      </Segment>
    )
  }

  render = () => {
    return (
      <Fragment>
        <Header className="header-module" inverted attached="top" as="h4">
          {this.props.title}
        </Header>
        {this.renderSegment()}
      </Fragment>
    )
  }
}

export default Flipboard
