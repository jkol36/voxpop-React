import React, { PureComponent } from "react"
import { compose, graphql, withApollo } from "react-apollo"
import { Segment, Container } from "semantic-ui-react"
import { GET_USER_REQUEST_INVITES } from "../../../graphql/queries"
import { UPDATE_USER_INVITE_REQUEST } from "../../../graphql/mutations"
import ManageInvites from "../ManageInvites/ManageInvites"

class ManageInvitesContainer extends PureComponent {
  state = { userInviteRequests: [] }

  UNSAFE_componentWillReceiveProps = nextProps => {
    const _userInviteRequests = nextProps.userInviteRequests
    this.setState({ userInviteRequests: _userInviteRequests })
  }

  handleButtons = async (userId, e) => {
    const buttonName = e.target.getAttribute("name")
    let action = "NEW"
    switch (buttonName) {
      case "approve":
        action = "APPROVED"
        break
      case "decline":
        action = "DECLINED"
        break
      case "resend":
        action = "RESEND"
        break
      default:
        action = "NEW"
        break
    }

    await this.props.client.mutate({
      mutation: UPDATE_USER_INVITE_REQUEST,
      variables: {
        user_invite_id: userId,
        action
      },
      refetchQueries: [{ query: GET_USER_REQUEST_INVITES }]
    })
  }

  render = () => {
    return (
      <Segment as={Container} basic vertical>
        <ManageInvites
          userInviteRequests={this.state.userInviteRequests}
          handleButtons={this.handleButtons}
        />
      </Segment>
    )
  }
}

export default withApollo(
  compose(
    graphql(GET_USER_REQUEST_INVITES, {
      props: ({ data: { userInviteRequests } }) => ({
        userInviteRequests
      })
    })
  )(ManageInvitesContainer)
)
