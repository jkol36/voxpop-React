import React from "react"
import { Container, Grid, Placeholder, Segment } from "semantic-ui-react"
import "./UserPlaceHolder.css"

const UserPlaceHolder = () => (
  <Segment as={Container} basic>
    <div
      style={{
        backgroundColor: "white",
        marginTop: "10px",
        borderTopRightRadius: "25px",
        borderTopLeftRadius: "25px",
        padding: "15px 15px 30px"
      }}
    >
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Placeholder fluid className="wall">
              <Placeholder.Image rectangular />
            </Placeholder>
          </Grid.Column>
        </Grid.Row>
        {/* <Grid.Row>
          <Grid.Column floated="left" width={6}>
            <Placeholder fluid className="history">
              <Placeholder.Image rectangular />
            </Placeholder>
          </Grid.Column>
          <Grid.Column floated="right" width={10}>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Placeholder fluid className="users-text">
                    <Placeholder.Image rectangular />
                  </Placeholder>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Placeholder fluid className="users-qoute">
                    <Placeholder.Image rectangular />
                  </Placeholder>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row> */}
        <Grid.Row>
          <Grid.Column floated="left" width={16}>
            <Placeholder fluid className="history">
              <Placeholder.Image rectangular />
            </Placeholder>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  </Segment>
)

export default UserPlaceHolder
