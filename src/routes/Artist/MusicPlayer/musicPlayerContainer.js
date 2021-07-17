import React, { PureComponent } from "react"
import { graphql, compose } from "react-apollo"
import { GET_SONG, GET_ARTIST_INFO } from "../../../graphql/queries"
import MusicPlayer from "./MusicPlayer"

class MusicPlayerContainer extends PureComponent {
  render = () => {
    return <MusicPlayer {...this.props} />
  }
}

export default compose(
  graphql(GET_SONG, {
    options: ({ songId }) => ({ variables: { song_id: songId } }),
    props: ({ data: { song } }) => {
      if (song) {
        const spotify = song.media.find(item => item.provider === "spotify")
        if (spotify) {
          return {
            score: song.total_score,
            upvotes: song.upvotes,
            downvotes: song.downvotes,
            songTitle: song.title,
            spotifyUri: spotify.native_uri
          }
        }
      }
    }
  }),
  graphql(GET_ARTIST_INFO, {
    options: ({ artistId }) => ({ variables: { artist_id: artistId } }),
    props: ({ data: { artist } }) => {
      if (artist) {
        return {
          artistName: artist.name
        }
      }
    }
  })
)(MusicPlayerContainer)
