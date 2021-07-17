import React, { PureComponent } from "react"
import { Header, Container, Segment, Grid } from "semantic-ui-react"

export class Terms extends PureComponent {
  render = () => {
    return (
      <Segment as={Container} basic>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <div>
                <Header as="h2" attached="top">
                  Terms of Use and Privacy Policy
                </Header>
                <Segment attached>
                  <p>Contents.....</p>
                </Segment>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}

export default Terms
