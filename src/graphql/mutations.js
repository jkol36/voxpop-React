import gql from "graphql-tag"

export const CREATE_VOTE = gql`
  mutation($vote: VoteInput) {
    createVote(vote: $vote)
  }
`

export const FOLLOW = gql`
  mutation follow($artist_id: Int!, $user_id: String!) {
    follow(artist_id: $artist_id, user_id: $user_id) {
      _id
      artist_id
      name
      image_url
      total_score
      upvotes
      downvotes
    }
  }
`

export const UNFOLLOW = gql`
  mutation follow($artist_id: Int!, $user_id: String!) {
    unfollow(artist_id: $artist_id, user_id: $user_id) {
      _id
      artist_id
      name
      image_url
      total_score
      upvotes
      downvotes
    }
  }
`

export const UPDATE_USER = gql`
  mutation updateUser($user: UserInput) {
    updateUserProfile(user: $user) {
      _id
      name
      username
      email
      quotes
      avatar
    }
  }
`

export const FOLLOW_USERS = gql`
  mutation followUser($user_id: String!) {
    followUser(user_id: $user_id, action: "follow") {
      _id
      name
      username
      email
      avatar
      quotes
      _followersId
      _followingId
    }
  }
`

export const UNFOLLOW_USERS = gql`
  mutation followUser($user_id: String!) {
    followUser(user_id: $user_id, action: "unfollow") {
      _id
      name
      username
      email
      avatar
      quotes
      _followersId
      _followingId
    }
  }
`

export const USER_REQUEST_INVITE = gql`
  mutation sendUserInvite($email: String!, $resendFlag: Boolean!) {
    sendUserInvite(mail_to: $email, resendFlag: $resendFlag)
  }
`

export const USER_RESEND_INVITE = gql`
  mutation resendUserInvite($email: String!) {
    resendUserInvite(mail_to: $email)
  }
`

export const UPDATE_USER_INVITE_REQUEST = gql`
  mutation updateUserInviteRequest($user_invite_id: String!, $action: String!) {
    sendUserInviteApproval(user_invite_id: $user_invite_id, action: $action)
  }
`

export const UPDATE_USER_ADMIN_RIGHTS = gql`
  mutation updateUserAdminRight($user_id: String!, $admin: Boolean!) {
    updateUserAdminRight(user_id: $user_id, admin: $admin) {
      _id
      name
      admin
      primary
    }
  }
`

export const CREATE_COMMENT = gql`
  mutation createComment($comment: CommentInput!) {
    createComment(comment: $comment)
  }
`
