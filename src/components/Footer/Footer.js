import React, { PureComponent } from "react"
import { Container, Menu } from "semantic-ui-react"

class Footer extends PureComponent {
  render = () => {
    return (
      <Menu
        fluid
        borderless
        attached="bottom"
        size="small"
        style={{ minHeight: "75px", marginTop: "auto" }}
      >
        <Container>
          <Menu.Item>@ 2017 HipHop Scoreboard, All rights reserved.</Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>Terms of Service</Menu.Item>
            <Menu.Item>About Us</Menu.Item>
            <Menu.Item>Contact Info</Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
}

export default Footer
