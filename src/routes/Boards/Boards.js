import React, { Component } from "react"
import {
  Grid,
  Segment,
  Header
} from "semantic-ui-react"
import { connect } from "react-redux"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import Subscoreboard from "../../components/Subscoreboard/Subscoreboard"
import AdminPanel from "../../components/AdminPanel/AdminPanel"
import JoinScoreboard from "../../components/Subscoreboard/JoinScoreboard"

const query = gql`
  query domain($key: String) {
    domain(key: $key) {
      title
      description
      allowedUserIds
      privacy
      _id
    }
  }
`

const CONTENTS_QUERY = gql`
  query contents($domainId: String) {
    contents(domainId: $domainId) {
      title
      created
      score
      text
      _id
      url
    }
  }
`

class Boards extends Component {
  render = () => {
    const { match, userId } = this.props
    return (
      <Query query={query} variables={{ key: match.params.domain }}>
        {({ loading, error, data }) => {
          if (error) return <div>Error: {error.messge}</div>
          if (loading) return <div>Loading...</div>
          const {
            title,
            description,
            allowedUserIds,
            privacy,
            _id
          } = data.domain

          const userExist = allowedUserIds.find(id => id === userId)
          const showPage =
            (userExist && privacy === "private") || privacy === "public"

          if (!showPage)
            return <JoinScoreboard domainId={_id} userId={userId} />

          return (
            <Query query={CONTENTS_QUERY} variables={{ domainId: _id }}>
              {({ loading, error, data }) => {
                if (error) return <div>Error: {error.message}</div>
                if (loading) return <div>Loading...</div>
                return (
                  <Segment basic>
                    <Header as="h2">
                      {title}
                      <Header.Subheader>{description}</Header.Subheader>
                    </Header>
                    <Grid>
                      <Grid.Row>
                        <Grid.Column width={12}>
                          <Subscoreboard contents={data.contents} />
                        </Grid.Column>
                        <Grid.Column width={4}>
                          <AdminPanel domainId={_id} />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Segment>
                )
              }}
            </Query>
          )
        }}
      </Query>
    )
  }
}

const mapStateToProps = ({ login: { user } }) => ({
  userId: user._id
})

export default connect(mapStateToProps)(Boards)
