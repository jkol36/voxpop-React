import React, { Component } from "react"
import { Container, Grid, Segment, Icon } from "semantic-ui-react"
import { Query } from "react-apollo"
import { connect } from "react-redux"
import gql from "graphql-tag"
import ProfileHeader from "../../components/UserProfile/ProfileHeader"
import UserPlaceHolder from "../../components/UserProfile/UserPlaceHolder/UserPlaceHolder"
import "./User.css"
import UserChat from "../../components/Chat/UserChat"
import moment from "moment"
import { sortBy, isEmpty } from "lodash"

export const QUERY_USER_PROFILE = gql`
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
        created
      }
      contents {
        _id
        domain {
          key
        }
        creator {
          name
        }
        title
        text
        created
        scoreDetails {
          upvotes
          downvotes
          total
        }
      }
      comments {
        text
        created
        contentId
        scoreDetails {
          upvotes
          downvotes
          total
        }
        contentTitle
      }
      followedUserProfileData {
        comments {
          text
          created
          contentId
          scoreDetails {
            upvotes
            downvotes
            total
          }
          contentTitle
          commenterName
        }
        quotes {
          quote
          content {
            title
          }
          creator {
            name
            profileImageUrl
          }
          created
        }
        history
        contents {
          _id
          domain {
            key
          }
          creator {
            name
          }
          title
          text
          created
          scoreDetails {
            upvotes
            downvotes
            total
          }
        }
      }
    }
  }
`

const userRoomQuery = gql`
  query userChatRoom($userId: String!) {
    userChatRoom(userId: $userId) {
      _id
      users
      messageType
      created
    }
  }
`

function formatContentDate(sDate) {
  const a = moment.utc()
  const b = moment.utc(sDate)
  const dateDiff = a.diff(b, "days")
  if (dateDiff <= 1) {
    return moment(sDate)
      .calendar()
      .toString()
      .replace("at", "@")
  }
  return moment(sDate).format("MMM Do")
}

const ProfilePageRows = props => (
  <div className="activity-rows">
    <Grid>
      <Grid.Column
        width={1}
        className="top-content-row"
        floated="right"
        style={{ padding: "25px 0 0 25px", fontWeight: "bold", fontSize: 9 }}
      >
        {props.dateCreated}
      </Grid.Column>
      <Grid.Column width={14}>
        <fieldset style={{ borderColor: props.color }}>
          <legend className="legend" style={{ color: props.color }}>
            {props.legend}
          </legend>
          <Grid>
            <Grid.Column width={14}>
              {props.type === "Quote" ? <i>{props.text}</i> : props.text}
            </Grid.Column>
            {props.type !== "Quote" && (
              <Grid.Column float="right" width={2}>
                <strong className="activityScoreUp">+{props.upvotes}</strong>{" "}
                <strong className="activityScore"> / </strong>
                <strong className="activityScoreDown">
                  -{props.downvotes}
                </strong>
              </Grid.Column>
            )}
          </Grid>
        </fieldset>
      </Grid.Column>
      <Grid.Column
        width={1}
        className="top-content-row-margin"
        style={{ padding: 0 }}
      >
        <Icon link name="bookmark" size="large" />
        <Icon link name="sign-out alternate" size="large" />
      </Grid.Column>
    </Grid>
  </div>
)

class User extends Component {
  state = {
    userId: "",
    showChat: false,
    leftFilter: "All",
    rightFilter: "User",
    page: 1,
    limit: 5,
    startIndex: 0
  }
  static defaultProps = {
    userId: "none"
  }

  handleShowChat = showChat => {
    this.setState({ showChat })
  }

  handlePageChange = (event, { activePage }, total) => {
    const startIndex = activePage * 5 - 6
    console.log(startIndex)
    /* if (this.state.page + 1 < total) */ this.setState({
      page: activePage,
      startIndex
    })
  }

  renderUserChat = name => {
    const { userId } = this.props.match.params // current user profile page
    const variable = { userId }
    return (
      <Query query={userRoomQuery} variables={variable}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading messages...</div>
          if (error) return <div>Error loading messages</div>
          const { _id } = data.userChatRoom
          return <UserChat messageRoomId={_id} {...this.props} name={name} />
        }}
      </Query>
    )
  }

  handleFilter = filter => {
    if (filter === "User" || filter === "Following") {
      this.setState({ rightFilter: filter })
    } else {
      this.setState({ leftFilter: filter })
    }
  }

  render = () => {
    const { userId } = this.props.match.params
    const { leftFilter, rightFilter /* page, limit, startIndex */ } = this.state
    return (
      <Query
        query={QUERY_USER_PROFILE}
        variables={{
          userId: userId
        }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data }) => {
          if (loading) return <UserPlaceHolder />
          if (error) return <div>Error: {error.message}</div>

          const { user } = data
          let contents = [],
            history = [],
            comments = [],
            quotes = []
          const contentTitles = user.contents.map(content => ({
            text: content.title,
            key: content.title,
            value: content._id,
            domain: content.domain.key
          }))
          if (rightFilter === "User") {
            contents = [...user.contents]
            history = [...user.history]
            comments = [...user.comments]
            quotes = [...user.quotes]
          } else {
            user.followedUserProfileData.forEach(user => {
              !isEmpty(user.contents) && contents.push(...user.contents)
              !isEmpty(...user.history) && history.push(...user.history)
              !isEmpty(...user.comments) && comments.push(...user.comments)
              !isEmpty(...user.quotes) && quotes.push(...user.quotes)
            })
          }
          let sortedDataList = sortBy(
            [...contents, ...history, ...comments],
            "created"
          )
          sortedDataList = sortedDataList.sort((a, b) => {
            let totalVotes
            if (a.scoreDetails && b.scoreDetails) {
              const voteTotal1 =
                a.scoreDetails.upvotes - a.scoreDetails.downvotes
              const voteTotal2 =
                b.scoreDetails.upvotes - b.scoreDetails.downvotes
              totalVotes = voteTotal2 - voteTotal1
            } else {
              totalVotes = -1
            }
            return totalVotes
          })

          if (leftFilter === "All") {
            sortedDataList = [...sortedDataList, ...sortBy(quotes, ["created"])]
          } else if (leftFilter === "Quotes") {
            sortedDataList = [...sortBy(quotes, ["created"])]
          } else if (leftFilter === "Votes") {
            sortedDataList = sortedDataList.filter(item => !item.__typename)
          } else {
            sortedDataList = sortedDataList.filter(
              item => item.__typename === leftFilter
            )
          }
          return (
            <React.Fragment>
              <Segment as={Container} basic>
                <div className={"profile-content"}>
                  <ProfileHeader
                    user={user}
                    texts={contentTitles}
                    handleShowChat={this.handleShowChat}
                  />
                  <Grid>
                    <Grid.Row columns={2} style={{ marginTop: 25 }}>
                      <Grid.Column floated="left" width={6}>
                        <span
                          className={
                            leftFilter === "All" ? "active-filter" : "filter"
                          }
                          onClick={() => this.handleFilter("All")}
                          style={{}}
                        >
                          All
                        </span>
                        <span
                          className={
                            leftFilter === "Content"
                              ? "active-filter"
                              : "filter"
                          }
                          onClick={() => this.handleFilter("Content")}
                          style={
                            leftFilter === "Content" || leftFilter === "All"
                              ? { borderLeft: "3px solid black" }
                              : { borderLeft: "3px solid #A5A5A5" }
                          }
                        >
                          Content
                        </span>
                        <span
                          className={
                            leftFilter === "Votes" ? "active-filter" : "filter"
                          }
                          onClick={() => this.handleFilter("Votes")}
                          style={
                            leftFilter === "Content" || leftFilter === "Votes"
                              ? { borderLeft: "3px solid black" }
                              : { borderLeft: "3px solid #A5A5A5" }
                          }
                        >
                          Votes
                        </span>
                        <span
                          className={
                            leftFilter === "Comment"
                              ? "active-filter"
                              : "filter"
                          }
                          onClick={() => this.handleFilter("Comment")}
                          style={
                            leftFilter === "Comment" || leftFilter === "Votes"
                              ? { borderLeft: "3px solid black" }
                              : { borderLeft: "3px solid #A5A5A5" }
                          }
                        >
                          Comments
                        </span>
                        <span
                          className={
                            leftFilter === "Quotes" ? "active-filter" : "filter"
                          }
                          onClick={() => this.handleFilter("Quotes")}
                          style={
                            leftFilter === "Comment" || leftFilter === "Quotes"
                              ? { borderLeft: "3px solid black" }
                              : { borderLeft: "3px solid #A5A5A5" }
                          }
                        >
                          Quotes
                        </span>
                      </Grid.Column>
                      <Grid.Column floated="right" width={3}>
                        <span
                          className={
                            rightFilter === "User" ? "active-filter" : "filter"
                          }
                          onClick={() => this.handleFilter("User")}
                          style={{ borderRight: "3px solid black" }}
                        >
                          User
                        </span>
                        <span
                          className={
                            rightFilter === "Following"
                              ? "active-filter"
                              : "filter"
                          }
                          onClick={() => this.handleFilter("Following")}
                        >
                          Following
                        </span>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={16}>
                        {sortedDataList.map((data, index) => {
                          let color, legend, text
                          const type = data.__typename
                            ? data.__typename
                            : data.action
                          switch (type) {
                            case "Content":
                              color = "#6200EE"
                              legend =
                                rightFilter === "User"
                                  ? `submitted`
                                  : `submitted by ${data.creator.name}`
                              text = data.title
                              break
                            case "Quote":
                              color = "#0094FF"
                              legend =
                                rightFilter === "User"
                                  ? `quoted ${data.content.title}`
                                  : `quoted by ${data.creator.name} on ${
                                      data.content.title
                                    }`
                              text = `"${data.quote}"`
                              break
                            case "upvote":
                              color = "#02D57C"
                              legend =
                                rightFilter === "User"
                                  ? `upvoted ${data.title}`
                                  : `upvoted by ${data.author} on ${data.title}`
                              text = data.description
                              break
                            case "downvote":
                              color = "#FF516D"
                              legend =
                                rightFilter === "User"
                                  ? `downvoted ${data.title}`
                                  : `downvoted by ${data.author} on ${
                                      data.title
                                    }`
                              text = data.description
                              break
                            default:
                              color = "#F8B300"
                              legend =
                                rightFilter === "User"
                                  ? `commented on ${data.contentTitle}`
                                  : `${data.commenterName} commented on ${
                                      data.contentTitle
                                    }`
                              text = data.text
                              break
                          }
                          const dateCreated = formatContentDate(data.created)
                          return (
                            <ProfilePageRows
                              key={`type-${index}`}
                              legend={legend}
                              color={color}
                              dateCreated={dateCreated}
                              upvotes={
                                data.scoreDetails
                                  ? data.scoreDetails.upvotes
                                  : 0
                              }
                              downvotes={
                                data.scoreDetails
                                  ? data.scoreDetails.downvotes
                                  : 0
                              }
                              text={text}
                              page={1}
                              type={type}
                            />
                          )
                        })}
                        {/* <br />
                        <center>
                          <Pagination
                            defaultActivePage={1}
                            activePage={page}
                            totalPages={dataCount / limit}
                            onPageChange={(e, data) =>
                              this.handlePageChange(e, data, dataCount / limit)
                            }
                          />
                        </center> */}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </div>
              </Segment>
              {this.state.showChat &&
                userId !== this.props.userId &&
                this.renderUserChat(user.name)}
            </React.Fragment>
          )
        }}
      </Query>
    )
  }
}

const mapStateToProps = ({ login: { user } }) => ({
  userId: user._id,
  creatorId: user.creatorId
})

export default connect(mapStateToProps)(User)
