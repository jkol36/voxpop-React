import gql from "graphql-tag"

export const GET_SCORE = gql`
  query getVote($id: Int!) {
    scoreBySong(song_id: $id)
  }
`

export const GET_COMMENTS = gql`
  query comments($songId: Int) {
    comments(songId: $songId)
  }
`

export const GET_UPVOTES_PER_SONG = gql`
  query upvotes($song_id: Int!) {
    upvotes(song_id: $song_id)
  }
`

export const GET_DOWNVOTES_PER_SONG = gql`
  query downvotes($song_id: Int!) {
    downvotes(song_id: $song_id)
  }
`

export const GET_ARTIST_INFO = gql`
  query getArtistInfo($artist_id: Int!) {
    artist(artist_id: $artist_id) {
      _id
      artist_id
      name
      image_url
      total_score
      upvotes
      downvotes
      followers {
        _id
        avatar
      }
    }
  }
`

export const GET_TRACKS = gql`
  query getTracks($artist_id: Int!) {
    albums(artist_id: $artist_id) {
      _id
      artist_id
      album_id
      title
      songs {
        _id
        artist_ids
        featured_artist_ids
        song_id
        album_id
        full_title
        title
        lyrics
        media
        thumbnail
        total_score
        upvotes
        downvotes
      }
    }
  }
`

export const GET_SONG = gql`
  query getSong($song_id: Int!) {
    song(song_id: $song_id) {
      _id
      title
      lyrics
      media
      total_score
      upvotes
      downvotes
    }
  }
`

export const GET_USER_INFO = gql`
  query getUser($user_id: String!, $username: String) {
    user(user_id: $user_id, username: $username) {
      _id
      name
      username
      email
      avatar
      _followersId
      _followingId
      vote_cast
      points
      submissions {
        title
      }
    }
  }
`

export const GET_TOP_ARTISTS = gql`
  query getTopArtists {
    topArtists(limit: 5)
  }
`

export const GET_USER_LABELS = gql`
  query getUserFantasyLabels($user_id: String!, $username: String) {
    userFantasyLabels(user_id: $user_id, username: $username) {
      user_id
      artist_id
      name
      score
    }
  }
`

export const SEARCH = gql`
  query search($query: String!) {
    lyricistSearch(query: $query) {
      query
      response
    }
  }
`

export const GET_TRENDING_SONGS = gql`
  query trendingSongs($limit: Int!) {
    trendingSongs(limit: $limit)
  }
`

export const GET_RECOMMENDED_SONGS = gql`
  query recommendedSongs($limit: Int!) {
    recommendedSongs(limit: $limit)
  }
`

export const GET_NEWS_FEED = gql`
  query activities($limit: Int!) {
    activities(limit: $limit)
  }
`

export const GET_USER_REQUEST_INVITES = gql`
  query inviteRequests {
    userInviteRequests {
      _id
      email
      status
      _userId
      created
    }
  }
`

export const GET_USER_VOTE_LOGS = gql`
  query getUserVoteLogs($user_id: String!, $username: String) {
    userVoteLogs(user_id: $user_id, username: $username) {
      _id
      _userId
      _voteId
      songTitle
      songArtist
      description
      action
      tokens
      created
    }
  }
`

export const GET_USERS = gql`
  query users {
    users {
      _id
      name
      username
      email
      admin
      primary
    }
  }
`
