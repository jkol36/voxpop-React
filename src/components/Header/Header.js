import React, { PureComponent, Fragment } from "react"
import { withApollo, Query, Subscription } from "react-apollo"
import { connect } from "react-redux"
import { Link, withRouter } from "react-router-dom"
import {
  Button,
  Dropdown,
  Image,
  Menu,
  Search,
  Container,
  Label
} from "semantic-ui-react"
import { toast, ToastContainer } from "react-toastify"
import axios from "axios"
import $ from "jquery"
import { isEmpty, sortBy, find } from "lodash"
import moment from "moment"

import { GET_ARTIST_INFO, GET_TOP_ARTISTS } from "../../graphql/queries"
import {
  tokenValidator,
  userLogin,
  userLogout
} from "../../actions/creators/loginActionCreator"
import gql from "graphql-tag"
import { APP_TOKEN } from "../../utils/constants"
import PropTypes from "prop-types"
import "./Header.css"

require("../../assets/jquery/jquery.splitflap")

const search = gql`
  query search($text: String!) {
    searchContent(text: $text) {
      _id
      title
      domain {
        key
      }
    }
    searchCreator(text: $text) {
      _id
      name
    }
  }
`
const GET_USER_NOTIFICATIONS = gql`
  query notifications($userId: String!) {
    notifications(userId: $userId)
  }
`
const UDATE_NOTIFICATION_STATUS = gql`
  mutation updateNotificationStatus($userId: String!, $status: String!) {
    updateNotificationStatus(userId: $userId, status: $status)
  }
`

const SUBSCRIBER_NOTIFICATIONS = gql`
  subscription notificationCreated($userId: String!) {
    notificationCreated(userId: $userId)
  }
`

class HeaderComponent extends PureComponent {
  state = { search: "Search", noResult: false }

  static propTypes = {
    login: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  componentDidMount() {
    $(document).ready(function() {
      var ratio = 0.4
      $(".logoflap").splitFlap({
        image: require("../../assets/chars.png"),
        charsMap: "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789#",
        charSubstitute: " ",
        speed: 25,
        speedVariation: 25,
        text: "",
        textInit: "",
        autoplay: true,
        charWidth: 50 * ratio,
        charHeight: 100 * ratio,
        imageSize: 2500 * ratio + "px " + 100 * ratio + "px"
      })
    })

    if (!tokenValidator()) {
      this.props.logout(null)
    }
  }

  UNSAFE_componentWillMount = () => {
    this.resetComponent()
  }

  handleResultSelect = (e, { result }) => {
    const { history } = this.props
    switch (result.__typename) {
      case "User":
        history.push(`${this.props.routing.url}/user/${result._id}`)
        break
      case "Content":
        history.push(`/boards/${result.domain.key}/content/${result._id}`)
        break
      default:
        break
    }
  }

  handleSearchChange = async (e, { value }) => {
    this.setState({ isLoading: true, value })
    const list = (await this.search()(value)).data

    if (this.state.value === value) {
      if (this.state.value.length < 1) return this.resetComponent()

      if (list.searchCreator.length === 0 && list.searchContent.length === 0) {
        this.setState({ noResult: true, isLoading: false, results: [] })
      } else {
        if (list.searchContent.length === 0) {
          this.setState({
            isLoading: false,
            results: {
              users: {
                name: "Users",
                results: list.searchCreator
                  .map(creator => ({
                    ...creator,
                    title: creator.name
                  }))
                  .slice(0, 5)
              }
            }
          })
        } else if (list.searchCreator.length === 0) {
          this.setState({
            isLoading: false,
            results: {
              contents: {
                name: "Contents",
                results: list.searchContent.slice(0, 5)
              }
            }
          })
        } else {
          this.setState({
            isLoading: false,
            results: {
              contents: {
                name: "Contents",
                results: list.searchContent.slice(0, 5)
              },
              users: {
                name: "Users",
                results: list.searchCreator
                  .map(creator => ({
                    ...creator,
                    title: creator.name
                  }))
                  .slice(0, 5)
              }
            }
          })
        }
      }
    }
  }

  handleViewNotif = (notifCount, client) => {
    if (notifCount > 0) {
      const userId = this.props.login.user._id
      client.mutate({
        mutation: UDATE_NOTIFICATION_STATUS,
        variables: { userId, status: "seen" }
      })
    }
  }

  handleVisitNotif = (client, id, status) => {
    const userId = this.props.login.user._id
    if (status !== "visited") {
      client.mutate({
        mutation: UDATE_NOTIFICATION_STATUS,
        variables: { userId: id, status: "visited" },
        refetchQueries: [
          { query: GET_USER_NOTIFICATIONS, variables: { userId } }
        ]
      })
    }
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: "" })

  search = () => {
    if (this.props.client) {
      return async payload => {
        return await this.props.client.query({
          query: search,
          context: { token: APP_TOKEN },
          variables: { text: payload },
          refetchQueries: [
            {
              query: GET_ARTIST_INFO,
              variables: { artist_id: this.props.artistId }
            },
            {
              query: GET_TOP_ARTISTS
            }
          ]
        })
      }
    }
  }

  // TODO move this out of this component to maintain code reliability.
  createGuestUser = async () => {
    const guest = await axios.post(process.env.REACT_APP_SERVER + "/guest")
    this.props.guestLogin(
      guest.data.username,
      guest.data.username,
      this.props.history
    )
    await toast.success("Successfully login as Guest!")
  }

  renderProfileMenu = () => {
    const { avatar } = this.props.login.user
    return <Image avatar src={avatar} size="mini" />
  }

  renderUserAccount = () => {
    const { login } = this.props
    const userId =
      login && "user" in login ? login.user._id : "59b006a2dba5fb0027f48c76"
    return (
      <Menu.Item>
        <Dropdown
          trigger={this.renderProfileMenu()}
          pointing="top right"
          icon={null}
        >
          <Dropdown.Menu>
            <Dropdown.Item
              key="user"
              icon="user"
              as={Link}
              name="account"
              to={`/user/${userId}`}
              text="Profile"
            />
            <Dropdown.Item
              key="add-content"
              icon="add"
              as={Link}
              name="add-content"
              to={this.props.routing.url + "/submit-content"}
              text="Add Content"
            />
            <Dropdown.Item
              as={Link}
              name="settings"
              to={`/settings`}
              text="Settings"
              icon="settings"
            />
            <Dropdown.Item
              as={Link}
              key="sign-out"
              name="sign-out"
              to={"/logout"}
              text="Sign Out"
              icon="sign out"
              onClick={() => {}}
            />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
    )
  }

  renderNotif = (notifCount, client) => {
    return (
      <Fragment>
        <Button
          circular
          color="orange"
          icon="bell"
          className="notif-button"
          onClick={() => this.handleViewNotif(notifCount, client)}
        />
        {notifCount > 0 && (
          <Label color="red" id="notif-counter" floating circular>
            {notifCount}
          </Label>
        )}
      </Fragment>
    )
  }

  renderDefaultNotif = () => {
    return (
      <Menu.Item>
        <Dropdown trigger={this.renderNotif()} pointing="top right" icon={null}>
          <Dropdown.Menu>
            <Dropdown.Item
              key={"notif-0"}
              text="No notifications"
              icon="bell"
            />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
    )
  }

  renderRightMenuItem = () => {
    const { isLoading, value, results, noResult } = this.state
    if (!tokenValidator()) return this.renderLoginMenuItem()
    const userId = this.props.login.user._id
    return (
      <Menu.Menu position="right" stackable="true" className="item">
        <Menu.Item as={Link} name="home" to={"/home"} className="item-menu">
          HOME
        </Menu.Item>
        <Menu.Item
          as={Link}
          name="top content"
          to={"/top-content"}
          className="item-menu"
        >
          TOP CONTENT
        </Menu.Item>
        <Menu.Item>
          <Search
            category
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            results={results}
            value={value}
            showNoResults={noResult}
          />
        </Menu.Item>
        <Query
          query={GET_USER_NOTIFICATIONS}
          variables={{ userId }}
          fetchPolicy={"cache-and-network"}
        >
          {({ loading, error, notifData, client }) => {
            return (
              <Subscription
                subscription={SUBSCRIBER_NOTIFICATIONS}
                variables={{ userId }}
                onSubscriptionData={({ client, subscriptionData }) => {
                  console.log("Notifications", subscriptionData)
                }}
              >
                {({ loading2, error2, data }) => {
                  const isLoading = loading || loading2
                  const isError = error || error2
                  if (isLoading) return this.renderDefaultNotif()
                  if (isError) return this.renderDefaultNotif()
                  let notificationsList
                  if (
                    data &&
                    find(data.notificationCreated, ["userId", userId])
                  ) {
                    notificationsList = sortBy(data.notificationCreated, [
                      "created"
                    ])
                  } else {
                    notificationsList = sortBy(
                      notifData && notifData.notifications,
                      ["created"]
                    )
                  }
                  const newNotifications = notificationsList.filter(
                    item => item.status === "new"
                  )
                  const notifCount = newNotifications.length
                  return (
                    <Menu.Item>
                      {/* <Button circular color="orange" icon="bell" /> */}
                      <Dropdown
                        trigger={this.renderNotif(notifCount, client)}
                        pointing="top right"
                        icon={null}
                      >
                        <Dropdown.Menu>
                          {isEmpty(notifData && notifData.notifications) ? (
                            <Dropdown.Item
                              key={"notif-0"}
                              text="No notifications"
                              icon="bell"
                            />
                          ) : (
                            notificationsList.reverse().map((item, index) => {
                              let icon, url
                              const {
                                _id,
                                contentDomain,
                                contentId,
                                followerUserId,
                                label,
                                status,
                                created,
                                senderUserId
                              } = item
                              switch (item.notifType) {
                                case "comment":
                                  icon = "comment alternate"
                                  url = `/boards${contentDomain}/content/${contentId}`
                                  break
                                case "message":
                                  icon = "discussions"
                                  url = `/user/${senderUserId}`
                                  break
                                case "post":
                                  icon = "edit"
                                  url = `/boards${contentDomain}/content/${contentId}`
                                  break
                                case "follow":
                                  icon = "users"
                                  url = `/user/${followerUserId}`
                                  break
                                default:
                                  icon = "bell"
                                  url = "/"
                                  break
                              }
                              return (
                                <Dropdown.Item
                                  key={`notif${index}`}
                                  active={status !== "visited"}
                                  as={Link}
                                  name="notification"
                                  to={url}
                                  text={`${label}`}
                                  description={`${moment(created).fromNow()}`}
                                  icon={icon}
                                  onClick={() =>
                                    this.handleVisitNotif(client, _id, status)
                                  }
                                />
                              )
                            })
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Menu.Item>
                  )
                }}
              </Subscription>
            )
          }}
        </Query>
        {tokenValidator() && this.renderUserAccount()}
      </Menu.Menu>
    )
  }

  renderLoginMenuItem = () => {
    return (
      <Menu.Menu position="right">
        <Menu.Item name="sign-in">
          <Dropdown item text="LOGIN" pointing="top right">
            <Dropdown.Menu>
              <Dropdown.Item
                key="registered"
                icon="user"
                as={Link}
                name="registered"
                to={this.props.routing.url + "/login"}
                text="Registered"
              />
              <Dropdown.Item
                key="guest"
                icon="user secret"
                name="guest"
                text="Guest"
                onClick={this.createGuestUser}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Menu.Menu>
    )
  }

  render = () => {
    const pathName = this.props.location.pathname
    if (pathName === this.props.routing.url + "/invite") return ""
    return (
      <Menu
        fixed="top"
        color="black"
        size="small"
        inverted
        stackable
        borderless
        compact
      >
        <Container>
          <Menu.Menu position="left">
            <Menu.Item>
              <Image floated="left" size="medium" as={Link} to="/">
                <div className="logoflap">SCOREBOARD</div>
              </Image>
            </Menu.Item>
          </Menu.Menu>
          {this.renderRightMenuItem()}
          <ToastContainer
            position="bottom-left"
            autoClose={2000}
            closeOnClick
          />
        </Container>
      </Menu>
    )
  }
}

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = dispatch => ({
  guestLogin: (username, password, history) => {
    dispatch(userLogin(username, password, history))
  },
  logout: history => {
    dispatch(userLogout(history))
  },
  updateCurrentSong: (artistId, songId) =>
    dispatch({
      type: "UPDATE_CURRENT_SONG",
      payload: {
        currentArtist: artistId,
        currentSongId: songId
      }
    })
})

export default withApollo(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(HeaderComponent)
  )
)
