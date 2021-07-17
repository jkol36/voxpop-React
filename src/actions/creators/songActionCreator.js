import client from "../../config/apollo"
import {
  GET_DOWNVOTES_PER_SONG,
  GET_UPVOTES_PER_SONG,
  GET_SCORE
} from "../../graphql/queries"

export const songScores = songId => {
  return async (dispatch, getState) => {
    const { query } = client
    let score = (await query({
      query: GET_SCORE,
      variables: { id: songId }
    })).data
    score = score.scoreBySong

    let upvotes = (await query({
      query: GET_UPVOTES_PER_SONG,
      variables: { song_id: songId }
    })).data
    upvotes = upvotes.upvotes

    let downvotes = (await query({
      query: GET_DOWNVOTES_PER_SONG,
      variables: { song_id: songId }
    })).data
    downvotes = downvotes.downvotes

    const payload = {
      currentSongScore: score,
      currentSongUpvotes: upvotes,
      currentSongDownvotes: downvotes,
      currentSongId: songId
    }

    dispatch({ type: "UPDATE_CURRENT_SONG", payload })
  }
}
