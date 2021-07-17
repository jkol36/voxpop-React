import React, { Component } from "react"
import { Divider, Icon, Item } from "semantic-ui-react"
import FlexView from "react-flexview"
import PropTypes from "prop-types"
import moment from "moment"
import ReactTooltip from "react-tooltip"
import { ApolloConsumer } from "react-apollo"
import gql from "graphql-tag"
import { getContent } from "../../routes/content/Content"
import { USER_BUDDY_LIST } from "../Chat/ChatGraphQL"

const BOOKMARK_CONTENT = gql`
  mutation createContentChatRoom($contentId: String!) {
    createContentChatRoom(contentId: $contentId) {
      _id
      users
      messageType
    }
  }
`
const REMOVE_BOOKMARK_CONTENT = gql`
  mutation removeContentChatRoom($contentId: String!) {
    removeContentChatRoom(contentId: $contentId) {
      _id
      users
      messageType
    }
  }
`

class ContentPanel extends Component {
  state = {
    bookmark:
      this.props.userContentChatRoom &&
      this.props.userContentChatRoom._id !== "0"
  }

  static propTypes = {
    title: PropTypes.string,
    score: PropTypes.shape({
      upvotes: PropTypes.number,
      downvotes: PropTypes.number
    }),
    bookmark: PropTypes.bool,
    created: PropTypes.string,
    contentId: PropTypes.string,
    userContentChatRoom: PropTypes.object,
    key: PropTypes.string
  }

  static defaultProps = {
    title: "Unknown Content",
    score: {
      upvotes: 0,
      downvotes: 0
    },
    bookmark: false,
    contentId: "",
    key: "",
    userContentChatRoom: {
      _id: "0"
    }
  }

  handleClick = client => {
    const _bookmark = this.state.bookmark
    this.setState({ bookmark: !_bookmark })
    const { contentId, key } = this.props
    client.mutate({
      mutation: !_bookmark ? BOOKMARK_CONTENT : REMOVE_BOOKMARK_CONTENT,
      variables: { contentId },
      refetchQueries: [
        { query: getContent, variables: { contentId, key } },
        { query: USER_BUDDY_LIST }
      ]
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.contentId !== prevProps.contentId) {
      const { userContentChatRoom } = this.props
      const isBookMarked =
        userContentChatRoom && userContentChatRoom._id !== "0"
      this.setState({ bookmark: isBookMarked })
    }
  }

  render = () => {
    const { title, score, created } = this.props
    const { bookmark } = this.state
    return (
      <ApolloConsumer>
        {client => (
          <div style={{ margin: "20px" }}>
            <FlexView vAlignContent="center">
              <div style={{ fontFamily: "'Raleway', sans-serif" }}>
                <b style={{ fontWeight: 600 }}>{title} </b>
                <Icon
                  data-for="bookmark"
                  data-tip={
                    bookmark
                      ? "Remove bookmark."
                      : "Bookmark content to buddy list."
                  }
                  name="bookmark"
                  link
                  color={bookmark ? "green" : "black"}
                  onClick={() => this.handleClick(client)}
                />
                <ReactTooltip id="bookmark" />
                <span
                  style={{
                    marginLeft: "200px",
                    marginRight: "5px",
                    float: "right"
                  }}
                >
                  <Icon name="chevron up" color="green" size="large" />
                  <b> {score.upvotes}</b>
                  <Icon name="chevron down" color="red" size="large" />
                  <b> {score.downvotes}</b>
                </span>
              </div>
            </FlexView>
            <Divider />
            {this.props.children}
            <Divider />
            <Item.Extra>
              <span
                style={{
                  color: "#d6d6d6",
                  float: "right",
                  marginLeft: "10px",
                  fontWeight: 200
                }}
              >
                Posted {moment(created).format("MMM DD, YYYY")}
              </span>
            </Item.Extra>
          </div>
        )}
      </ApolloConsumer>
    )
  }
}

export default ContentPanel
