import React, { Component } from "react"
import {
  Button,
  Comment,
  Form,
  TextArea,
  Icon,
  Placeholder
} from "semantic-ui-react"
import PropTypes from "prop-types"
import gql from "graphql-tag"
import { Query } from "react-apollo"
import moment from "moment"
import { Link } from "react-router-dom"

const USER_QUERY = gql`
  query user($user_id: String!) {
    user(user_id: $user_id) {
      avatar
      name
    }
  }
`

class CommentsPanel extends Component {
  static propTypes = {
    comments: PropTypes.array,
    loading: PropTypes.bool
  }

  static defaultProps = {
    comments: []
  }

  state = {
    text: ""
  }

  handleAddComment = event => {
    this.props.onAddComment(event, this.state.text)
    this.setState({ text: "" })
  }

  handleTextAreaChange = (e, text) => {
    this.setState({ text: text.value })
  }

  renderLoading = () => {
    return (
      <div style={{ marginTop: 20 }}>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </div>
    )
  }

  renderUserComment = comment => {
    const variables = { user_id: comment.userId }
    return (
      <Query query={USER_QUERY} variables={variables}>
        {({ loading, error, data }) => {
          if (loading || this.props.loading) return this.renderLoading()
          if (error) return <div>Error getting user comment...</div>
          const { user } = data
          return (
            <Comment key={comment._id}>
              <Comment.Avatar src={user.avatar} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/user/${comment.userId}`}>
                  {user.name}
                </Comment.Author>
                <Comment.Text>{comment.text}</Comment.Text>
                <Comment.Action>
                  <span style={{ float: "left" }}>
                    <Icon name="heart" color="grey" />
                    <Icon name="pin" color="grey" />
                  </span>
                  <small style={{ marginLeft: "50px", color: "grey" }}>
                    2 likes
                  </small>
                  <span
                    style={{
                      float: "right",
                      marginRight: "15px",
                      color: "grey"
                    }}
                  >
                    <Icon name="clock" color="grey" />
                    <small>{moment(comment.created).fromNow()}</small>
                  </span>
                </Comment.Action>
              </Comment.Content>
            </Comment>
          )
        }}
      </Query>
    )
  }

  renderComments = () => {
    const { text } = this.state
    const { comments, loading } = this.props
    return (
      <Comment.Group size="small">
        <Form reply>
          <div>
            <TextArea
              style={{
                height: "50px",
                maxWidth: "280px",
                position: "relative",
                display: "inline-block"
              }}
              placeholder="Comment.."
              onChange={this.handleTextAreaChange}
              value={text}
            />
            <Button
              circular
              icon="send"
              style={{ marginTop: "10px", marginLeft: "5px" }}
              onClick={this.handleAddComment}
            />
          </div>
        </Form>
        {comments.length > 0 || loading ? (
          comments.map(comment => {
            return this.renderUserComment(comment)
          })
        ) : (
          <div style={{ marginTop: 25 }}>No comments available</div>
        )}
      </Comment.Group>
    )
  }

  render = () => {
    return (
      <div
        style={{
          padding: "5px 5px 20px 20px",
          background: "linear-gradient(150deg, #f7f7f7 0%, #f0f0f0 100%)"
        }}
      >
        {this.renderComments()}
      </div>
    )
  }
}

export default CommentsPanel
