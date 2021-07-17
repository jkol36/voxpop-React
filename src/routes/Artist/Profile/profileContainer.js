import React, { PureComponent } from "react"
import { graphql, compose, withApollo } from "react-apollo"
import { GET_ARTIST_INFO } from "../../../graphql/queries"
import { connect } from "react-redux"
import { FOLLOW, UNFOLLOW } from "../../../graphql/mutations"
import Profile from "./Profile"

class ProfileContainer extends PureComponent {
  handleFollow = async event => {
    const { followers, userId } = this.props
    if (followers) {
      const isFollower = followers.find(x => x._id === userId)
      await this.props.client.mutate({
        mutation: isFollower ? UNFOLLOW : FOLLOW,
        variables: {
          artist_id: this.props.artistId,
          user_id: this.props.userId
        },
        refetchQueries: [
          {
            query: GET_ARTIST_INFO,
            variables: { artist_id: this.props.artistId }
          }
        ]
      })
    }
  }

  render = () => {
    const { client, followers, userId, ...others } = this.props
    let isFollower = false
    if (followers) {
      isFollower = followers.find(x => {
        return x._id === userId
      })
    }
    return (
      <Profile
        isFollower={isFollower}
        followers={followers}
        onFollow={this.handleFollow}
        {...others}
      />
    )
  }
}

const mapStateToProps = ({ login }) => {
  if (login && login.user) {
    return {
      userId: login.user._id
    }
  }
}

export default withApollo(
  compose(
    connect(mapStateToProps),
    graphql(GET_ARTIST_INFO, {
      options: ({ artistId }) => ({ variables: { artist_id: artistId } }),
      props: ({ data: { artist } }) => {
        if (artist) {
          return {
            name: artist.name,
            score: artist.total_score,
            up: artist.upvotes,
            down: artist.downvotes,
            followers: artist.followers,
            image: artist.image_url
          }
        }
      }
    })
  )(ProfileContainer)
)
