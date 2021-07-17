import React, { PureComponent } from "react"
import {
  Button,
  Container,
  Divider,
  Grid,
  Message,
  Segment
} from "semantic-ui-react"
import { Mutation, Query, withApollo } from "react-apollo"
import { connect } from "react-redux"
import gql from "graphql-tag"

import CreatorPanel from "../../components/CreatorPanel/CreatorPanel"
import CommentsPanel from "../../components/CommentsPanel/CommentsPanel"
import VotingBoard from "../../components/VotingBoard/VotingBoard"
//import ActionPopup from "../../components/VotingBoard/ActionPopup"
import Maximized from "../../components/Chat/Maximized"
import Minimized from "../../components/Chat/Minimized"
import VotingPopup from "../../components/VotingBoard/VotingPopup"
import AdminPanel from "../../components/AdminPanel/AdminPanel"

import { FixedWrapper, ThemeProvider } from "@livechat/ui-kit"
import "./Content.css"
import Contents from "../../components/ContentPanel/Contents"
import { cloneDeep } from "lodash"

const QUERY_USER_PROFILE = gql`
  query user($userId: String!) {
    user(user_id: $userId) {
      _id
      avatar
      name
      creator {
        _id
      }
      _followingId
      _followersId
      scoreDetails {
        upvotes
        downvotes
      }
      history
      quotes {
        quote
        content {
          title
        }
        creator {
          name
          profileImageUrl
        }
      }
      contents {
        _id
        domain {
          _id
          key
        }
        creator {
          name
        }
        title
        text
      }
    }
  }
`

export const getContent = gql`
  query content($contentId: String!, $key: String!) {
    content(contentId: $contentId) {
      creatorId
      _id
      title
      text
      thumbnail
      created
      creator {
        name
        profileImageUrl
        scoreDetails {
          upvotes
          downvotes
          total
        }
      }
      scoreDetails {
        upvotes
        downvotes
        total
      }
      comments {
        _id
        userId
        text
        hashtags
        created
      }
    }
    domain(key: $key) {
      _id
      allowedUserIds
      pendingUserIds
      adminIds
      privacy
    }
    userContentChatRoom(contentId: $contentId) {
      _id
      users
      messageType
    }
  }
`

const addVote = gql`
  mutation addVote($vote: VoteInput!) {
    addVote(vote: $vote) {
      contentId
      type
      points
      startWordIndex
      endWordIndex
    }
  }
`

const addComment = gql`
  mutation addComment($comment: CommentInput!) {
    addComment(comment: $comment) {
      _id
    }
  }
`

const addQuote = gql`
  mutation addQuote($quote: QuoteInput!) {
    addQuote(quote: $quote) {
      _id
    }
  }
`

export const MESSAGE_MUTATION = gql`
  mutation createMessage($message: MessageInput!) {
    createMessage(message: $message) {
      _id
      contentId
      userId
      userName
      title
      text
      date
    }
  }
`

export const CHAT_SUBSCRIPTION = gql`
  subscription onMessageCrated($contentId: String!) {
    messageCreated(contentId: $contentId) {
      _id
      contentId
      userId
      userName
      userAvatar
      title
      text
      imageUrl
      date
    }
  }
`

const CHAT_QUERY = gql`
  query chats($contentId: String!) {
    messages(contentId: $contentId) {
      _id
      contentId
      userId
      userName
      userAvatar
      title
      text
      imageUrl
      date
    }
  }
`

const ADD_PENDING_USER = gql`
  mutation addPendingUser($domainId: String!, $userId: String!) {
    addPendingUser(domainId: $domainId, userId: $userId) {
      allowedUserIds
      pendingUserIds
    }
  }
`

class Content extends PureComponent {
  handleVoting = async (event, data) => {
    const { select } = this.state
    const { client, match } = this.props
    const { contentId, domain } = match.params

    const vote = {
      ...data,
      startWordIndex: select.startIndex,
      endWordIndex: select.endIndex,
      contentId,
      creatorId: this.props.creatorId,
      userId: this.props.userId,
      text: select.text
    }

    const voteData = await client.mutate({
      mutation: addVote,
      variables: {
        vote
      } /* ,
      refetchQueries: [
        {
          query: getContent,
          variables: { contentId }
        }
      ] */
    })
    if (voteData && voteData.data.addVote) {
      const { addVote } = voteData.data
      const content = client.readQuery({
        query: getContent,
        variables: { contentId, key: domain }
      })

      const clonedContent = cloneDeep(content)

      if (addVote.type === "upvote") {
        let { upvotes } = clonedContent.content.scoreDetails
        clonedContent.content.scoreDetails.upvotes = upvotes + 1
      } else {
        const { downvotes } = clonedContent.content.scoreDetails
        clonedContent.content.scoreDetails.downvotes = downvotes + 1
      }

      client.writeQuery({
        query: getContent,
        variables: { contentId, key: domain },
        data: { ...clonedContent }
      })
    }
  }
  handleAddComment = (event, comment) => {
    let startIndex, endIndex

    const { client, match, creatorId, userId } = this.props
    const { contentId, domain } = match.params

    const HASHTAGS_REGEX = /#(\w|\d)+/g
    const hashtags = comment.match(HASHTAGS_REGEX)

    if (this.state) {
      const { select } = this.state
      startIndex = select.startIndex
      endIndex = select.endIndex
    } else {
      startIndex = 0
      endIndex = 0
    }

    const newComment = {
      contentId,
      creatorId,
      userId,
      text: comment,
      startWordIndex: startIndex,
      endWordIndex: endIndex,
      hashtags
    }

    client.mutate({
      mutation: addComment,
      variables: { comment: newComment },
      refetchQueries: [
        {
          query: getContent,
          variables: { contentId, key: domain }
        }
      ]
    })
  }

  handleShareQuote = (event, quote) => {
    const { client, userId, creatorId, match } = this.props
    const { contentId } = match.params

    const newQuote = {
      contentId,
      creatorId,
      userId,
      quote
    }

    client.mutate({
      mutation: addQuote,
      variables: { quote: newQuote },
      refetchQueries: [
        {
          query: QUERY_USER_PROFILE,
          variables: { userId }
        }
      ]
    })
  }

  sendMessage = data => {
    const { client, match } = this.props
    const { contentId } = match.params

    const newMessage = {
      contentId,
      title: "", // TODO
      text: data,
      imageUrl: "" // TODO
    }

    client.mutate({
      mutation: MESSAGE_MUTATION,
      variables: { message: newMessage }
    })
  }

  handleSelect = select => {
    this.setState({ select })
  }

  renderAdminPanel = (domainId, adminIds) => {
    if (adminIds.find(id => id === this.props.userId)) {
      return (
        <Grid.Column width={4}>
          <AdminPanel domainId={domainId} />
        </Grid.Column>
      )
    } else {
      return null
    }
  }

  render = () => {
    const { contentId, domain } = this.props.match.params
    if (!contentId) return <div>No content id passed!</div>
    const variables = { contentId, key: domain }

    const tempData = {
      title: "",
      text: "",
      scoreDetails: [],
      comments: [],
      created: ""
    }

    return (
      <div className="jumbotron">
        <Query
          query={getContent}
          variables={variables}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data }) => {
            if (error) return <div>{`Error: ${error}`}</div>

            let showPage = true

            if (loading) return <div>Loading</div>

            if (!loading) {
              const { allowedUserIds, privacy } = data.domain
              const { creatorId } = data.content
              showPage =
                (allowedUserIds.find(id => id === this.props.userId) &&
                  privacy === "private") ||
                privacy === "public" ||
                creatorId === this.props.creatorId
            }

            //  In Pending Ids
            if (
              data.domain.pendingUserIds.find(id => id === this.props.userId)
            ) {
              return (
                <Message positive>
                  <Message.Header>
                    You have successfully requested to join the board. You're
                    request is under consideration of the Admin and you will be
                    informed if accepted.
                  </Message.Header>
                </Message>
              )
            }

            if (!showPage) {
              const { _id: domainId } = data.domain

              return (
                <Segment as={Container} basic>
                  <Message negative>
                    <Message.Header>
                      You are not authorize to view this content!
                    </Message.Header>
                  </Message>
                  <Mutation domain={domainId} mutation={ADD_PENDING_USER}>
                    {(addPendingUser, { data, error }) => {
                      console.log("Mutation add pending user props", this.props)
                      const { userId } = this.props
                      // const { domainId : _id } = data.domain
                      console.log("Mutation data.domain", data)
                      if (!data)
                        return (
                          <Button
                            color="teal"
                            size="mini"
                            onClick={() =>
                              addPendingUser({
                                variables: { domainId, userId }
                              })
                            }
                          >
                            Request to Join Board
                          </Button>
                        )
                      return (
                        <Message positive>
                          <Message.Header>
                            Thanks, we'll get that right over for the Admin to
                            review...
                          </Message.Header>
                        </Message>
                      )
                    }}
                  </Mutation>
                </Segment>
              )
            }
            const { title, text, scoreDetails, comments, created } = loading
              ? tempData
              : data.content
            const creator = loading ? "" : data.content.creator || {}
            const { userContentChatRoom } = data
            const { _id: domainId, adminIds } = data.domain

            return (
              <React.Fragment>
                <Grid doubling stackable>
                  <Grid.Row columns={1}>
                    <Grid.Column>
                      <CreatorPanel
                        image={creator.profileImageUrl}
                        creator={creator.name}
                        score={creator.scoreDetails}
                        enableFollow
                        loading={loading}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <div className="sort-header">
                        <i className="fas fa-sort-amount-down" />
                        <h1>Recent Posts</h1>
                      </div>
                      <Divider />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={3}>
                    <Grid.Column width={3}>
                      <Contents
                        creatorId={loading ? "" : data.content.creatorId}
                        contentId={contentId}
                        loading={loading}
                      />
                    </Grid.Column>
                    <Grid.Column width={7}>
                      <VotingBoard
                        title={title}
                        // topOffset={this.state.voteProps.topOffset}
                        content={text}
                        score={scoreDetails}
                        created={created}
                        onSelect={this.handleSelect}
                        userContentChatRoom={userContentChatRoom}
                        contentId={contentId}
                        key={domain}
                        loading={loading}
                      >
                        {/* <ActionPopup
                            text={text}
                            // orientation={this.state.voteProps.orientation}
                            onVote={this.handleVoting}
                            onAddComment={this.handleAddComment}
                            onShareQuote={this.handleShareQuote}
                            onOrientationChange={this.handleChangeOrientation}
                          /> */}
                        {({ text }) => (
                          <VotingPopup
                            text={text}
                            // orientation={this.state.voteProps.orientation}
                            onVote={this.handleVoting}
                            onAddComment={this.handleAddComment}
                            onShareQuote={this.handleShareQuote}
                            onOrientationChange={this.handleChangeOrientation}
                          />
                        )}
                      </VotingBoard>
                    </Grid.Column>
                    <Grid.Column>
                      <CommentsPanel
                        comments={comments}
                        loading={loading}
                        onAddComment={this.handleAddComment}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  {this.renderAdminPanel(domainId, adminIds)}
                </Grid>
                <Query query={CHAT_QUERY} variables={variables}>
                  {({ subscribeToMore, ...result }) => (
                    <ThemeProvider>
                      <FixedWrapper.Root>
                        <FixedWrapper.Maximized>
                          <Maximized
                            {...this.props}
                            {...result}
                            title={title}
                            ownId={this.props.userId}
                            sendMessage={this.sendMessage}
                            onMessageSend={this.sendMessage}
                            subscribeToNewMessages={() =>
                              subscribeToMore({
                                document: CHAT_SUBSCRIPTION,
                                variables: { contentId },
                                updateQuery: (prev, { subscriptionData }) => {
                                  if (!subscriptionData.data) return prev
                                  const newMessage =
                                    subscriptionData.data.messageCreated
                                  return Object.assign({}, prev, {
                                    messages: [...prev.messages, newMessage]
                                  })
                                }
                              })
                            }
                          />
                        </FixedWrapper.Maximized>
                        <FixedWrapper.Minimized>
                          <Minimized {...this.props} />
                        </FixedWrapper.Minimized>
                      </FixedWrapper.Root>
                    </ThemeProvider>
                  )}
                </Query>
              </React.Fragment>
            )
          }}
        </Query>
      </div>
    )
  }
}

const mapStateToProps = ({ login: { user } }) => ({
  creatorId: user.creatorId,
  userId: user._id
})

export default withApollo(connect(mapStateToProps)(Content))
