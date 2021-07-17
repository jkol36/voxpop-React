import React from "react"
import PropTypes from "prop-types"
import gql from "graphql-tag"
import moment from "moment"
import { Query } from "react-apollo"
import { Item, Divider } from "semantic-ui-react"

const getUserCommentHistory = gql`
  query comments($userId: String!) {
    comments(userId: $userId)
  }
`
class CommentHistory extends React.Component {
  static propTypes = {
    userId: PropTypes.string.isRequired
  }

  render() {
    const { userId } = this.props
    return (
      <Query query={getUserCommentHistory} variables={{ userId }}>
        {({ loading, error, data }) => {
          if (error) return <div>Error loading history</div>
          if (loading) return <div>Loading history...</div>

          return data.comments.length === 0 ? (
            <div style={{ paddingBottom: 20 }}>
              <Divider />
              <span style={{ paddingTop: 20, paddingLeft: 10 }}>
                No comment history available
              </span>
            </div>
          ) : (
            <Item.Group
              divided
              style={{
                overflow: "hidden auto",
                maxHeight: "120vh",
                padding: "1em"
              }}
            >
              {data.comments.reverse().map((ch, index) => (
                <Item key={index}>
                  <Item.Content verticalAlign="bottom">
                    <Item.Description>{`"${ch.text}"`}</Item.Description>
                    <Item.Extra>
                      <span style={{ float: "left" }}>
                        {moment(ch.created).fromNow()}
                      </span>
                      <span style={{ float: "right" }} title="Content Name">{`${
                        ch.content.title
                      }`}</span>
                    </Item.Extra>
                  </Item.Content>
                </Item>
              ))}
            </Item.Group>
          )
        }}
      </Query>
    )
  }
}

export default CommentHistory
