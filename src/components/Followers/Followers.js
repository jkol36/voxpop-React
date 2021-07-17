import React, { Component } from "react"
import { Grid, Header, Image, Placeholder } from "semantic-ui-react"
import faker from "faker"
import "./Followers.css"
import _ from "lodash"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

const columns = _.times(12, i => (
  <Grid.Column key={i}>
    <div align="center">
      <Image src={faker.internet.avatar()} circular />
      <small
        style={{ float: "middle" }}
      >{`${faker.name.firstName()} ${faker.name.lastName()}`}</small>
    </div>
  </Grid.Column>
))

const query = gql`
  query user($userId: String!) {
    user(user_id: $userId) {
      _id
      avatar
      name
    }
  }
`

class Followers extends Component {
  renderFollowedUsers = () => {
    const { followedUsers } = this.props

    if (followedUsers.length > 0) {
      return followedUsers.map(followedUserId => (
        <Query
          query={query}
          variables={{
            userId: followedUserId
          }}
          key={followedUserId}
        >
          {({ loading, error, data }) => {
            if (loading)
              return (
                <Grid.Column key={followedUserId}>
                  <div align="center">
                    <Placeholder>
                      <Placeholder.Image square={false} />
                      <Placeholder.Line />
                    </Placeholder>
                  </div>
                </Grid.Column>
              )
            if (error) return <div>Error: {error.message}</div>
            const { user } = data
            return (
              <Grid.Column key={user._id} as={Link} to={`/user/${user._id}`}>
                <div align="center">
                  <Image src={user.avatar} circular />
                  <small style={{ float: "middle" }}>{user.name}</small>
                </div>
              </Grid.Column>
            )
          }}
        </Query>
      ))
    }

    return (
      <div>
        <span> No followed users! </span>
      </div>
    )
  }

  render = () => {
    const { faker } = this.props
    return (
      <div>
        <Header
          as="h1"
          style={{
            fontSize: 14,
            paddingTop: 20,
            paddingBottom: 20,
            marginBottom: 10,
            paddingLeft: 10,
            background: "rgba(150,150,150,0.1)",
            color: "rgba(50,50,50,0.7)"
          }}
        >
          Following
        </Header>
        <Grid columns={6}>{faker ? columns : this.renderFollowedUsers()}</Grid>
      </div>
    )
  }
}

Followers.propTypes = {
  followedUsers: PropTypes.array.isRequired
}
export default Followers
