import React, { Component } from "react"
import gql from "graphql-tag"
import { Query, Mutation } from "react-apollo"
import { Segment, Header, Modal, Button, Card, Image } from "semantic-ui-react"

const ADMIN_QUERY = gql`
  query admin($domainId: String) {
    domain(domainId: $domainId) {
      pendingUsers {
        name
        _id
        avatar
      }
    }
  }
`

const ACCEPT_USER = gql`
  mutation acceptUserToBoard($domainId: String!, $userId: String!) {
    acceptUserToBoard(domainId: $domainId, userId: $userId) {
      pendingUsers {
        name
      }
      allowedUserIds
    }
  }
`

class AdminPanel extends Component {
  state = { memberModalShow: false }

  render = () => {
    const { memberModalShow } = this.state
    const { domainId } = this.props
    return (
      <Query query={ADMIN_QUERY} variables={{ domainId }}>
        {({ loading, error, data }) => {
          if (error) return <div>Error: {error.message}</div>
          if (loading) return <div>Loading...</div>

          const { pendingUsers } = data.domain
          return (
            <Segment>
              <Header as="h3">Admin Panel</Header>
              <Button
                color="teal"
                icon="group"
                label={`${pendingUsers.length}`}
                onClick={() => this.setState({ memberModalShow: true })}
              />
              <Mutation mutation={ACCEPT_USER}>
                {(acceptUserToBoard, { data, error }) => {
                  if (error) return <div>Error: {error.message}</div>
                  return (
                    <Modal open={memberModalShow}>
                      <Modal.Header>Pending Members Invites</Modal.Header>
                      <Modal.Content>
                        {pendingUsers.length > 0 ? (
                          <Card.Group>
                            {pendingUsers.map(user => (
                              <Card key={user._id}>
                                <Card.Content>
                                  <Image
                                    src={user.avatar}
                                    size="mini"
                                    floated="left"
                                  />
                                  <Card.Header>{user.name}</Card.Header>
                                  <Card.Meta>New User</Card.Meta>
                                  <Card.Description>
                                    {`${
                                      user.name
                                    } wants to join your subscoreboard. `}
                                  </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                  <Button
                                    color="blue"
                                    onClick={() => {
                                      acceptUserToBoard({
                                        variables: {
                                          domainId,
                                          userId: user._id
                                        }
                                      })
                                      this.setState({ memberModalShow: false })
                                    }}
                                  >
                                    Accept
                                  </Button>
                                </Card.Content>
                              </Card>
                            ))}
                          </Card.Group>
                        ) : (
                          " No one wants to join your subscoreboard this time"
                        )}
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          onClick={() =>
                            this.setState({ memberModalShow: false })
                          }
                        >
                          Close
                        </Button>
                      </Modal.Actions>
                    </Modal>
                  )
                }}
              </Mutation>
            </Segment>
          )
        }}
      </Query>
    )
  }
}

export default AdminPanel
