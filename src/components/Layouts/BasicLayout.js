import React, { Component } from "react"
import { isMobile } from "react-device-detect"
import { Sidebar, Segment, Menu, Dimmer } from "semantic-ui-react"

import MobileHeader from "../Header/MobileHeader"

class BasicLayout extends Component {
  state = { toggle: false }

  handleToggle = event => {
    this.setState(prev => ({ toggle: !prev.toggle }))
  }

  render = () => {
    if (isMobile) {
      return (
        <Sidebar.Pushable as={Segment} basic style={{ minHeight: "100vh" }}>
          <Sidebar
            as={Menu}
            animation="overlay"
            visible={this.state.toggle}
            style={{ width: 270 }}
          >
            {this.props.children[0]}
          </Sidebar>
          <Sidebar.Pusher>
            <Dimmer.Dimmable
              dimmed={this.state.toggle}
              style={{ minHeight: "100vh" }}
            >
              <MobileHeader onOptionClick={this.handleToggle} />
              {this.props.children[1]}
              <Dimmer active={this.state.toggle} onClick={this.handleToggle} />
            </Dimmer.Dimmable>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      )
    }
    return this.props.children
  }
}

export default BasicLayout
