import React, { PureComponent } from "react"
import { Button, Header, Table, Loader } from "semantic-ui-react"
import PropTypes from "prop-types"

class ManageUsers extends PureComponent {
  static propTypes = {
    users: PropTypes.array
  }

  renderButtons = (admin, userId) => {
    const { handleButtons } = this.props
    if (!admin) {
      return (
        <div className="ui two buttons">
          <Button
            name="enable"
            basic
            color="green"
            onClick={e => handleButtons(userId, e)}
          >
            Set user as Admin
          </Button>
        </div>
      )
    } else {
      return (
        <div className="ui two buttons">
          <Button
            name="disable"
            basic
            color="red"
            onClick={e => handleButtons(userId, e)}
          >
            Disable Admin
          </Button>
        </div>
      )
    }
  }

  renderUserTableRows = () => {
    const { loginUserId } = this.props
    const users = this.props.users.filter(user => user._id !== loginUserId)
    return users.map((user, index) => (
      <Table.Row key={index}>
        <Table.Cell>
          <Header as="h4" image>
            <Header.Content>{user.name}</Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell>{user.username}</Table.Cell>
        <Table.Cell>{user.admin ? "YES" : "NO"}</Table.Cell>
        <Table.Cell>{this.renderButtons(user.admin, user._id)}</Table.Cell>
      </Table.Row>
    ))
  }

  render = () => {
    const { users } = this.props
    if (users && users.length > 0) {
      return (
        <Table fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>Admin</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{this.renderUserTableRows()}</Table.Body>
        </Table>
      )
    } else {
      return (
        <Loader active inline="centered">
          {" "}
          Loading Users{" "}
        </Loader>
      )
    }
  }
}

export default ManageUsers
