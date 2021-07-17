import React, { PureComponent } from "react"
import { Button, Header, Table, Label, Loader } from "semantic-ui-react"
import moment from "moment"
import TimeAgo from "react-timeago"
import PropTypes from "prop-types"

class ManageInvites extends PureComponent {
  static propTypes = {
    userInviteRequests: PropTypes.array
  }

  getStatusColor = status => {
    switch (status) {
      case "NEW":
        return "orange"
      case "DECLINED":
        return "red"
      default:
        return "green"
    }
  }

  renderButtons = (status, userId) => {
    const { handleButtons } = this.props
    if ("NEW" === status) {
      return (
        <div className="ui two buttons">
          <Button
            name="approve"
            basic
            color="green"
            onClick={e => handleButtons(userId, e)}
          >
            APPROVE
          </Button>
          <Button
            name="decline"
            basic
            color="red"
            onClick={e => handleButtons(userId, e)}
          >
            DECLINE
          </Button>
        </div>
      )
    } else if ("APPROVED" === status) {
      return (
        <Button
          name="resend"
          basic
          color="green"
          onClick={e => handleButtons(userId, e)}
        >
          RESEND
        </Button>
      )
    }
  }

  renderUserInviteRequests = () => {
    return this.props.userInviteRequests.map((user, index) => (
      <Table.Row key={index}>
        <Table.Cell>
          <Header as="h4" image>
            <Header.Content>
              {user.email}
              <Header.Subheader>
                <TimeAgo date={moment(user.created)} />
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>
          <Label style={{ color: this.getStatusColor(user.status) }}>
            {user.status === "RESEND" ? "APPROVED" : user.status}
          </Label>
        </Table.Cell>
        <Table.Cell>{this.renderButtons(user.status, user._id)}</Table.Cell>
      </Table.Row>
    ))
  }

  render = () => {
    const { userInviteRequests } = this.props
    if (userInviteRequests && userInviteRequests.length > 0) {
      return (
        <Table fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{this.renderUserInviteRequests()}</Table.Body>
        </Table>
      )
    } else {
      return (
        <Header as="h4">
          <Loader active inline="centered">
            {" "}
            Loading Request Invites{" "}
          </Loader>
        </Header>
      )
    }
  }
}

export default ManageInvites
