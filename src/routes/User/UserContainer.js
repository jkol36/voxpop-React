import React, { PureComponent } from "react"
import { graphql, compose, withApollo } from "react-apollo"
import { connect } from "react-redux"
import { GET_USER_INFO, GET_USER_LABELS } from "../../graphql/queries"
import User from "../User/User"
import { FOLLOW_USERS, UNFOLLOW_USERS } from "../../graphql/mutations"
import { APP_TOKEN } from "../../utils/constants"

class UserContainer extends PureComponent {
  state = { artist: {}, loading: true, showHistoryLogs: false }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (!nextProps.user) {
      const tempUser = {
        user_id: "",
        name: "",
        points: 0,
        vote_cast: 0,
        image:
          "https://www.digitalwallonia.be/wp-content/plugins/evenement/src/front/assets/img//contact-default.png",
        followers: 0,
        following: 0
      }

      this.setState({ user: tempUser, loading: false })
      return
    }

    const _user = nextProps.user
    const userFantasyLabels = nextProps.userFantasyLabels
    const showFollowButton = nextProps.loginUserId !== _user._id
    const isFollower = _user._followersId.find(x => x === nextProps.loginUserId)
    const user = {
      user_id: _user._id,
      name: _user.name,
      points: _user.points,
      vote_cast: _user.vote_cast,
      image: _user.avatar,
      followers: _user._followersId.length,
      following: _user._followingId.length,
      quotes: _user.quotes.slice(0, 5),
      isFollower: isFollower,
      showFollowButton
    }

    const showHistoryLogs = nextProps.loginUserId === _user._id

    const searchUser = nextProps.match.params.username
    const userId = nextProps.match.params.userId
    this.setState({
      user,
      userFantasyLabels,
      searchUser,
      userId,
      loading: false,
      showHistoryLogs,
      submissions: nextProps.user && nextProps.user.submissions
    })
  }

  handleFollow = async event => {
    const { user } = this.props
    const isFollower = user._followersId.find(x => x === this.props.loginUserId)
    if (user) {
      await this.props.client.mutate({
        mutation: isFollower ? UNFOLLOW_USERS : FOLLOW_USERS,
        variables: {
          user_id: user._id
        },
        context: { token: APP_TOKEN },
        refetchQueries: [
          {
            query: GET_USER_INFO,
            variables: { user_id: user._id },
            context: { token: APP_TOKEN }
          },
          {
            query: GET_USER_LABELS,
            variables: { user_id: user._id },
            context: { token: APP_TOKEN }
          }
        ]
      })
    }
  }

  render = () => {
    return (
      <div>
        <User
          user={this.state.user}
          userFantasyLabels={this.state.userFantasyLabels}
          onFollow={this.handleFollow}
          searchUser={this.state.searchUser}
          userId={this.state.userId}
          loading={this.state.loading}
          showHistoryLogs={this.state.showHistoryLogs}
          submissions={this.state.submissions}
        />
      </div>
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
    graphql(GET_USER_INFO, {
      options: ownProps => {
        const userId = ownProps && ownProps.match.params.userId
        const username = ownProps && ownProps.match.params.username
        return {
          variables: {
            user_id: typeof userId === "undefined" ? "" : userId,
            username
          },
          context: { token: APP_TOKEN }
        }
      },
      props: ({ data: { user } }) => ({
        user: user
      })
    }),
    graphql(GET_USER_LABELS, {
      options: ownProps => {
        const userId = ownProps && ownProps.match.params.userId
        const username = ownProps && ownProps.match.params.username
        return {
          variables: {
            user_id: typeof userId === "undefined" ? "" : userId,
            username
          },
          context: { token: APP_TOKEN }
        }
      },
      props: ({ data: { userFantasyLabels } }) => ({ userFantasyLabels })
    })
  )(UserContainer)
)
