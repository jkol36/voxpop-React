import React, { PureComponent } from "react"
import { compose, graphql, withApollo } from "react-apollo"
import { connect } from "react-redux"
import { Container, Segment } from "semantic-ui-react"
import { GET_USERS } from "../../../graphql/queries"
import { UPDATE_USER_ADMIN_RIGHTS } from "../../../graphql/mutations"
import ManageUsers from "../ManageUsers/ManageUsers"

class ManageUsersContainer extends PureComponent {
  state = { users: [] }

  UNSAFE_componentWillReceiveProps = nextProps => {
    const _users = nextProps.users
    this.setState({ users: _users })
  }

  handleButtons = async (userId, e) => {
    const buttonName = e.target.getAttribute("name")
    let admin = false
    switch (buttonName) {
      case "enable":
        admin = true
        break
      default:
        admin = false
        break
    }

    await this.props.client.mutate({
      mutation: UPDATE_USER_ADMIN_RIGHTS,
      variables: {
        user_id: userId,
        admin
      },
      refetchQueries: [{ query: GET_USERS }]
    })
  }

  render = () => {
    return (
      <Segment as={Container} basic vertical>
        <ManageUsers
          users={this.state.users}
          handleButtons={this.handleButtons}
          loginUserId={this.props.loginUserId}
        />
      </Segment>
    )
  }
}

const mapStateToProps = ({ login }) => {
  if (login && login.user) {
    return {
      loginUserId: login.user._id
    }
  }
}

export default withApollo(
  compose(
    connect(mapStateToProps),
    graphql(GET_USERS, {
      props: ({ data: { users } }) => ({
        users
      })
    })
  )(ManageUsersContainer)
)
