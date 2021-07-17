import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { withApollo, graphql, compose } from "react-apollo"
import Lyrics from "./Lyrics"
import {
  GET_SONG,
  GET_ARTIST_INFO,
  GET_TOP_ARTISTS,
  GET_USER_INFO,
  GET_COMMENTS
} from "../../../graphql/queries"
import {
  CREATE_VOTE,
  UPDATE_USER,
  CREATE_COMMENT
} from "../../../graphql/mutations"
import PropTypes from "prop-types"
class LyricsContainer extends PureComponent {
  state = { lyrics: "" }

  static propTypes = {
    songId: PropTypes.number.isRequired
  }

  vote = () => {
    if (this.props.client) {
      return async payload => {
        return await this.props.client.mutate({
          mutation: CREATE_VOTE,
          variables: { vote: payload },
          refetchQueries: [
            {
              query: GET_ARTIST_INFO,
              variables: { artist_id: this.props.artistId }
            },
            {
              query: GET_TOP_ARTISTS
            },
            {
              query: GET_SONG,
              variables: { song_id: this.props.songId }
            }
          ]
        })
      }
    }
  }

  comment = () => {
    if (this.props.client) {
      return async payload => {
        return await this.props.client.mutate({
          mutation: CREATE_COMMENT,
          variables: { comment: payload },
          refetchQueries: [
            {
              query: GET_COMMENTS,
              variables: { songId: this.props.songId }
            }
          ]
        })
      }
    }
  }

  shareQuote = () => {
    if (this.props.client) {
      return async payload => {
        return await this.props.client.mutate({
          mutation: UPDATE_USER,
          variables: { user: { _id: this.props.userId, ...payload } },
          refetchQueries: [
            {
              query: GET_USER_INFO,
              variables: { user_id: this.props.userId }
            }
          ]
        })
      }
    }
  }

  render = () => {
    const { client, ...others } = this.props
    return (
      <Lyrics
        onVoting={this.vote()}
        onShare={this.shareQuote()}
        onComment={this.comment()}
        {...others}
      />
    )
  }
}

const mapStateToProps = ({ login, artist }) => {
  if (login && login.user && artist && artist.currentSongId) {
    return { userId: login.user._id, songId: artist.currentSongId }
  }
  return null
}

const mapDispatchToProps = dispatch => ({
  onSongUpdate: song => {
    dispatch({ type: "UPDATE_CURRENT_SONG", payload: song })
  }
})

export default withApollo(
  compose(
    connect(mapStateToProps, mapDispatchToProps),
    graphql(GET_SONG, {
      options: ({ songId }) => ({ variables: { song_id: songId } }),
      props: ({ data: { song } }) => {
        if (song) {
          return {
            lyrics: song.lyrics,
            score: song.total_score,
            upvotes: song.upvotes,
            downvotes: song.downvotes
          }
        }
      }
    }),
    graphql(GET_USER_INFO, {
      options: ({ userId }) => ({ variables: { user_id: userId } }),
      props: ({ data: { user } }) => {
        if (user) {
          return { quotes: user.quotes }
        }
      }
    })
  )(LyricsContainer)
)
