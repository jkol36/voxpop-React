import React, { PureComponent } from "react"
import { compose } from "react-apollo"
import { connect } from "react-redux"
import {
  Container,
  Grid,
  Label,
  Menu,
  Segment,
  Header,
  Divider
} from "semantic-ui-react"
import EditProfile from "../User/EditProfile/EditProfile"
import ManageInvitesContainer from "../UserInvites/ManageInvites/manageInvitesContainer"
import ManageUsers from "../User/ManageUsers/manageUsersContainer"

class AppSettings extends PureComponent {
  state = { activeItem: "inbox" }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render = () => {
    const { activeItem } = this.state
    return (
      <Segment as={Container} basic>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column width={4}>
              {this.renderAdminMenuItems(this.props.admin)}
            </Grid.Column>
            <Grid.Column stretched width={12}>
              <Segment>
                <Header as="h3">{this.renderHeaderText(activeItem)}</Header>
                <Divider />
                {this.renderContent(activeItem)}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }

  renderAdminMenuItems = admin => {
    const { activeItem } = this.state
    if (admin) {
      return (
        <Menu fluid vertical>
          <Menu.Item
            name="profile"
            active={activeItem === "profile"}
            onClick={this.handleItemClick}
          >
            Profile
          </Menu.Item>

          <Menu.Item
            name="users"
            active={activeItem === "users"}
            onClick={this.handleItemClick}
          >
            <Label>6</Label>
            Users
          </Menu.Item>

          <Menu.Item
            name="invites"
            active={activeItem === "invites"}
            onClick={this.handleItemClick}
          >
            <Label>8</Label>
            Request Invites
          </Menu.Item>
        </Menu>
      )
    } else {
      return (
        <Menu fluid vertical>
          <Menu.Item
            name="profile"
            active={activeItem === "profile"}
            onClick={this.handleItemClick}
          >
            Profile
          </Menu.Item>
        </Menu>
      )
    }
  }

  renderContent = activeItem => {
    switch (activeItem) {
      case "users":
        return <ManageUsers />
      case "invites":
        return <ManageInvitesContainer />
      default:
        return <EditProfile />
    }
  }

  renderHeaderText = activeItem => {
    switch (activeItem) {
      case "users":
        return "Manage Users"
      case "invites":
        return "Manage User Request Invites"
      default:
        return "Edit Profile"
    }
  }
}

const mapStateToProps = ({ login }) => {
  if (login && login.user) {
    const { admin, primary, _id } = login.user
    return {
      loginUserId: _id,
      admin,
      primary
    }
  }
}

export default compose(connect(mapStateToProps))(AppSettings)
