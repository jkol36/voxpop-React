import React, { PureComponent } from "react"
import { withApollo } from "react-apollo"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import {
  /*  Button,
  Container, */
  Grid,
  Image,
  /* Modal, */
  Search
} from "semantic-ui-react"
import faker from "faker"
import gql from "graphql-tag"
import { APP_TOKEN } from "../../utils/constants"
/* import UserText from "../UserText/UserText" */
import "./ProfileHeader.css"
import PropTypes from "prop-types"
/* import classnames from "classnames" */
import { QUERY_USER_PROFILE } from "../../routes/User"

const search = gql`
  query search($text: String!) {
    searchContent(text: $text) {
      _id
      title
      creatorId
      domain {
        key
      }
    }
    searchCreator(text: $text) {
      _id
      name
      avatar
      creator {
        _id
      }
    }
  }
`

const FOLLOW_MUTATION = gql`
  mutation followUser($user_id: String!, $action: String!) {
    followUser(user_id: $user_id, action: $action) {
      _id
      name
    }
  }
`

class ProfileHeader extends PureComponent {
  state = {
    value: "Search Profile",
    results: [],
    noResult: false,
    toggle: false,
    _followersId: []
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { _followersId } = nextProps.user
    let followers = prevState._followersId
    let toggle = prevState.toggle
    if (_followersId !== prevState._followersId) {
      const userId = nextProps.login.user._id
      const result =
        _followersId && _followersId.filter(user => user === userId)
      followers = _followersId
      toggle = result.length
    }
    return { toggle, _followersId: followers }
  }

  handleFollow = toggle => event => {
    const { client } = this.props
    const { userId } = this.props.match.params // current user profile page
    this.setState({ toggle })

    client.mutate({
      mutation: FOLLOW_MUTATION,
      variables: { user_id: userId, action: toggle ? "follow" : "un-follow" },
      refetchQueries: [
        {
          query: QUERY_USER_PROFILE,
          variables: { userId }
        }
      ]
    })
  }

  handleFocus = (e, { value }) => {
    if (value === "Search Profile") {
      this.setState({ value: "" })
    }
  }
  handleBlur = () => {
    if (this.state.value.length === 0) {
      this.setState({ value: "Search Profile", isLoading: false })
    }
  }
  handleResultSelect = (e, { result }) => {
    if (result.__typename === "User") {
      const path = `/user/${result._id}`
      this.props.history.push(path)
    } else {
      const path = `/boards/${result.domain.key}/content/${result._id}`
      this.props.history.push(path)
    }
  }
  handleSearchChange = async (e, { value }) => {
    this.setState({ isLoading: true, value })
    if (value.length === 0) {
      this.setState({ results: [], isLoading: false })
    }

    const list = (await this.search()(value)).data

    if (this.state.value === value) {
      let searchCreator = []
      let creatorContent = []
      list.searchCreator.forEach(value => {
        searchCreator.push(value)
      })

      if (this.props.user.creator && list.searchContent.length !== 0) {
        list.searchContent.forEach(value => {
          if (value.creatorId === this.props.user.creator._id)
            creatorContent.push(value)
        })
      }

      if (searchCreator.length === 0 && creatorContent.length === 0) {
        this.setState({ noResult: true, isLoading: false, results: [] })
      } else {
        if (searchCreator.length === 0) {
          this.setState({
            isLoading: false,
            results: {
              contents: {
                name: "Contents",
                results: creatorContent.slice(0, 5)
              }
            }
          })
        } else if (creatorContent.length === 0) {
          this.setState({
            isLoading: false,
            results: {
              users: {
                name: "Users",
                results: searchCreator
                  .map(creator => ({
                    ...creator,
                    title: creator.name,
                    image: creator.avatar
                  }))
                  .slice(0, 5)
              }
            }
          })
        } else {
          this.setState({
            isLoading: false,
            results: {
              contents: {
                name: "Contents",
                results: creatorContent.slice(0, 5)
              },
              users: {
                name: "Users",
                results: searchCreator
                  .map(creator => ({
                    ...creator,
                    title: creator.name,
                    image: creator.avatar
                  }))
                  .slice(0, 5)
              }
            }
          })
        }
      }
    }
  }

  search = () => {
    if (this.props.client) {
      return async payload => {
        return await this.props.client.query({
          query: search,
          context: { token: APP_TOKEN },
          variables: { text: payload }
        })
      }
    }
  }

  render() {
    const { user /* texts, handleShowChat */ } = this.props
    const { value, results, isLoading, noResult /* toggle */ } = this.state
    let scoreValues = "Score 8 (10 / -2)"
    const { scoreDetails } = user
    if (scoreDetails) {
      scoreValues = `Score ${scoreDetails.upvotes - scoreDetails.downvotes} (${
        scoreDetails.upvotes
      } / -${scoreDetails.downvotes})`
    }

    /* const hideProfileMenuButtons = this.props.login.user._id === user._id

    const buttonLabel = toggle ? "FOLLOWED" : "FOLLOW" */

    return (
      <div>
        <Grid columns={16} className="profile-header">
          <Grid.Row columns={3}>
            <Grid.Column floated="left" verticalAlign="bottom" stretched>
              <div className="profile-card">
                <Image
                  src={!user ? faker.internet.avatar() : user.avatar}
                  size="small"
                  circular
                  floated="left"
                />
                <h2>
                  {!user
                    ? `${faker.name.firstName()} ${faker.name.lastName()}`
                    : user.name}
                </h2>
                <p>{scoreValues}</p>
              </div>
            </Grid.Column>
            <Grid.Column
              floated="right"
              verticalAlign="bottom"
              textAlign="right"
            >
              <Search
                category
                loading={isLoading}
                value={value}
                results={results}
                showNoResults={noResult}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onSearchChange={this.handleSearchChange}
                onResultSelect={this.handleResultSelect}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {/* <Container
          className={classnames(
            "button-group",
            hideProfileMenuButtons ? "button-hide" : "button-visible"
          )}
          textAlign="center"
        >
          <Button basic>INFO</Button>
          <Modal
            trigger={
              <Button basic color="green">
                POSTED CONTENT
              </Button>
            }
          >
            <Modal.Header>Posted Contents</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <UserText texts={texts} />
              </Modal.Description>
            </Modal.Content>
          </Modal>
          <Button basic color="teal" onClick={handleShowChat}>
            SEND MESSAGE
          </Button>
          <Button basic color="red">
            REPORT
          </Button>
          <Button color="twitter" onClick={this.handleFollow(!toggle)}>
            {buttonLabel}
          </Button>
        </Container> */}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state
}

ProfileHeader.propTypes = {
  user: PropTypes.object.isRequired,
  handleShowChat: PropTypes.func.isRequired
}

export default withApollo(withRouter(connect(mapStateToProps)(ProfileHeader)))
