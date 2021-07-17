import React, { Component, Fragment } from "react"
import { Container, Segment, Grid } from "semantic-ui-react"
import { Query, withApollo } from "react-apollo"
import { connect } from "react-redux"
import gql from "graphql-tag"

import VotingBoard from "../../components/VotingBoard/VotingBoard"
import ActionPopup from "../../components/VotingBoard/ActionPopup"

const GET_SHAREABLES = gql`
  query shareables($code: String!, $userId: String!) {
    text(code: $code) {
      _id
      title
      text
      authorId
      url
      created
    }
    user(user_id: $userId) {
      name
      quotes
    }
  }
`

const GET_SCORES = gql`
  query scores($textId: String) {
    customScores(textId: $textId)
  }
`

const CREATE_VOTE = gql`
  mutation createVote($vote: CustomVoteInput!) {
    createCustomVote(vote: $vote) {
      _id
      authorId
      userId
      textId
      isUpvote
      startIndex
      endIndex
      points
      created
    }
  }
`

const CREATE_COMMENT = gql`
  mutation createComment($comment: CustomCommentInput!) {
    createCustomComment(comment: $comment)
  }
`

const ADD_QUOTE = gql`
  mutation updateUserProfile($user: UserInput!) {
    updateUserProfile(user: $user) {
      _id
    }
  }
`

class Shareables extends Component {
  state = {
    selection: {},
    voteProps: {
      topOffset: 170,
      orientation: "vertical"
    }
  }

  textId = ""

  handleSelect = selection => {
    this.setState({ selection })
  }

  handleVote = (event, vote) => {
    this.props.client.mutate({
      mutation: CREATE_VOTE,
      variables: {
        vote: {
          textId: vote._id,
          userId: this.props.userId,
          authorId: vote.authorId,
          startIndex: vote.startIndex,
          endIndex: vote.endIndex,
          isUpvote: vote.type === "upvote"
        }
      },
      refetchQueries: [
        {
          query: GET_SCORES,
          variables: { textId: this.textId }
        }
      ]
    })
  }

  handleAddComment = (event, comment) => {
    this.props.client.mutate({
      mutation: CREATE_COMMENT,
      variables: {
        comment: {
          userId: this.props.userId,
          textId: comment._id,
          authorId: comment.authorId,
          content: comment.comment,
          startIndex: comment.startIndex,
          endIndex: comment.endIndex,
          hashtag: comment.hashtag
        }
      }
    })
  }

  handleShareQuote = (event, quote) => {
    this.props.client.mutate({
      mutation: ADD_QUOTE,
      variables: {
        user: { _id: this.props.userId, quotes: [quote.quote, ...quote.prev] }
      }
    })
  }

  handleChangeOrientation = (event, orientation) => {
    const isHorizontal = orientation === "horizontal"
    this.setState({
      voteProps: {
        topOffset: isHorizontal ? 60 : 170,
        orientation
      }
    })
  }

  render = () => {
    return (
      <Container>
        <Segment basic>
          <Query
            query={GET_SHAREABLES}
            variables={{
              code: this.props.match.params.code,
              userId: this.props.userId
            }}
          >
            {({ data: { text, user }, loading, error }) => {
              if (loading) return <div>Loading...</div>
              if (error) return <div>error</div>

              const textProfile = { ...text }
              if (text) {
                return (
                  <Fragment>
                    <Grid columns={4}>
                      <Grid.Row>
                        <Grid.Column>Submitted by: {user.name}</Grid.Column>
                        <Query
                          query={GET_SCORES}
                          variables={{ textId: textProfile._id }}
                        >
                          {({ data: { customScores }, loading, error }) => {
                            if (loading) return <div>Loading...</div>
                            if (error) return <div>Error: {error}</div>
                            if (customScores) {
                              this.textId = textProfile._id
                              return (
                                <Fragment>
                                  <Grid.Column>
                                    Total Points: {customScores.total}
                                  </Grid.Column>
                                  <Grid.Column>
                                    Upvotes: {customScores.upvotes}
                                  </Grid.Column>
                                  <Grid.Column>
                                    Downvotes: {customScores.downvotes}
                                  </Grid.Column>
                                </Fragment>
                              )
                            }
                          }}
                        </Query>
                      </Grid.Row>
                    </Grid>
                    <VotingBoard
                      title={text.title}
                      topOffset={this.state.voteProps.topOffset}
                      content={text.text}
                      onSelect={this.handleSelect}
                    >
                      {({ text }) => (
                        <ActionPopup
                          orientation={this.state.voteProps.orientation}
                          text={text}
                          onVote={(event, vote) =>
                            this.handleVote(event, {
                              ...vote,
                              ...textProfile,
                              ...this.state.selection
                            })
                          }
                          onAddComment={(event, comment) =>
                            this.handleAddComment(event, {
                              comment,
                              ...textProfile,
                              ...this.state.selection
                            })
                          }
                          onShareQuote={(event, quote) =>
                            this.handleShareQuote(event, {
                              quote,
                              userId: this.props.userId,
                              prev: user.quotes
                            })
                          }
                          onOrientationChange={this.handleChangeOrientation}
                        />
                      )}
                    </VotingBoard>
                  </Fragment>
                )
              }
            }}
          </Query>
        </Segment>
      </Container>
    )
  }
}

const mapStateToProps = ({ login: { user: { _id } } }) => ({ userId: _id })

export default withApollo(connect(mapStateToProps)(Shareables))
