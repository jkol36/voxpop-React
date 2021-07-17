import React, { PureComponent } from "react"
import { Grid, Container, Segment, Header, Loader } from "semantic-ui-react"

import SubmittedText from "./SubmittedText"
import UserProfile from "./UserProfile"
import TopArtists from "../../components/TopArtists/topArtistsContainer"
import FantasyLabel from "./FantasyLabel"
import UserWall from "./UserWall/UserWall"
import VoteLogs from "./VoteLogs/voteLogsContainer"
import Route404 from "../404"
import PropTypes from "prop-types"

class User extends PureComponent {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      points: PropTypes.number,
      vote_cast: PropTypes.number,
      image: PropTypes.string,
      followers: PropTypes.number,
      following: PropTypes.number
    }),
    fantasyLabels: PropTypes.shape({
      user_id: PropTypes.string,
      artist_id: PropTypes.number,
      name: PropTypes.string,
      score: PropTypes.number
    })
  }

  static defaultProps = {
    user: {
      user_id: "",
      name: "",
      points: 0,
      vote_cast: 0,
      image:
        "https://www.digitalwallonia.be/wp-content/plugins/evenement/src/front/assets/img//contact-default.png",
      followers: 0,
      following: 0
    },
    fantasyLabels: {}
  }

  render = () => {
    const {
      user,
      userFantasyLabels,
      searchUser,
      userId,
      loading,
      showHistoryLogs,
      ...others
    } = this.props

    if (user && user.user_id !== "") {
      return (
        <Segment as={Container} basic>
          <Grid doubling stackable>
            <Grid.Row columns={2}>
              <Grid.Column width={8}>
                <UserProfile user={user} {...others} />
              </Grid.Column>
              <Grid.Column width={8}>
                <TopArtists />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns="equal">
              <Grid.Column>
                <FantasyLabel fantasyLabels={userFantasyLabels} />
              </Grid.Column>
              <Grid.Column>
                <UserWall quotes={user.quotes} />
              </Grid.Column>
              <Grid.Column>
                <SubmittedText submissions={this.props.submissions} />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <VoteLogs
                  searchUser={searchUser}
                  userId={userId}
                  showHistoryLogs={showHistoryLogs}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      )
    } else if (loading) {
      return (
        <Segment as={Container} basic>
          <Header as="h4">
            <Loader active inline="centered" />
            {/*<Header.Content>User not exists :(</Header.Content>*/}
          </Header>
        </Segment>
      )
    } else {
      return <Route404 />
    }
  }
}

export default User
