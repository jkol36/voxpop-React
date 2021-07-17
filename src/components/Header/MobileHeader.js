import React, { Component } from "react"
import { Menu, Icon, Image } from "semantic-ui-react"
import PropTypes from "prop-types"

import logo from "../../assets/hiphop.png"

class MobileHeader extends Component {
  static propTypes = {
    onOptionClick: PropTypes.func
  }

  static defaultProps = {
    onOptionClick: () => {}
  }

  state = { toggle: false }

  handleOptionClick = event => {
    this.setState(
      prev => ({ toggle: !prev.toggle }),
      () => {
        this.props.onOptionClick(event, this.state.toggle)
      }
    )
  }

  render = () => {
    return (
      <Menu attached="top" color="black" size="huge" inverted borderless>
        <Menu.Item>
          <Image src={logo} height={30} />
        </Menu.Item>
        <Menu.Item position="right" onClick={this.handleOptionClick}>
          <Icon name="bars" />
        </Menu.Item>
      </Menu>
    )
  }
}

export default MobileHeader
