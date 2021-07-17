import React, { Component } from "react"
import { Container, Grid, Segment } from "semantic-ui-react"
import withSizes from "react-sizes"

import ActivityFeed from "../../components/ActivitiesStream/ActivityFeed"
import Updates from "../../components/Updates"

class Home extends Component {
  render = () => {
    return (
      <Segment as={this.props.isDesktop ? Container : null} basic>
        <Grid relaxed={false}>
          <Grid.Row columns={1} stretched>
            <Grid.Column stretched>
              <ActivityFeed />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1} stretched>
            <Grid.Column>
              <Updates />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}

const mapSizesToProps = ({ width }) => ({
  isDesktop: width > 1600
})

export default withSizes(mapSizesToProps)(Home)
