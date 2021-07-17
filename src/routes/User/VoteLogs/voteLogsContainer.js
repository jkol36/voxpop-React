import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { graphql, compose, withApollo } from "react-apollo"
import { Segment, Container } from "semantic-ui-react"
import { GET_USER_VOTE_LOGS } from "../../../graphql/queries"
import VoteLogs from "../VoteLogs/VoteLogs"
import { APP_TOKEN } from "../../../utils/constants"

class voteLogsContainer extends PureComponent {
  state = { userInviteRequests: [] }

  UNSAFE_componentWillReceiveProps = nextProps => {
    const _userVoteLogs = nextProps.userVoteLogs
    const _searchUser = nextProps.searchUser
    const _userId = nextProps.userId
    this.setState({
      userVoteLogs: _userVoteLogs,
      searchUser: _searchUser,
      userId: _userId
    })
  }

  render = () => {
    const { showHistoryLogs } = this.props

    if (showHistoryLogs) {
      return (
        <Segment as={Container} basic vertical>
          <VoteLogs userVoteLogs={this.state.userVoteLogs} />
        </Segment>
      )
    } else {
      return ""
    }
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
    graphql(GET_USER_VOTE_LOGS, {
      options: ownProps => {
        const searchUser = ownProps && ownProps.searchUser
        const tempUserId = ownProps && ownProps.userId
        const loginUserId = ownProps && ownProps.loginUserId
        let userId = ""
        if (
          typeof tempUserId === "undefined" &&
          typeof searchUser === "undefined"
        ) {
          userId = loginUserId
        } else if (
          typeof tempUserId !== "undefined" &&
          typeof searchUser === "undefined"
        ) {
          userId = tempUserId
        }

        return {
          variables: {
            user_id: userId,
            username: searchUser
          },
          context: { token: APP_TOKEN }
        }
      },
      props: ({ data: { userVoteLogs } }) => ({
        userVoteLogs
      })
    })
  )(voteLogsContainer)
)
