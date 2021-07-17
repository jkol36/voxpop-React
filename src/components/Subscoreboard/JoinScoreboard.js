import React, { Component } from "react"
import gql from "graphql-tag"
import { Mutation } from "react-apollo"
import { Segment, Container, Message, Button } from "semantic-ui-react"

const ADD_PENDING_USER = gql`
  mutation addPendingUser($domainId: String!, $userId: String!) {
    addPendingUser(domainId: $domainId, userId: $userId) {
      allowedUserIds
    }
  }
`

class JoinScoreboard extends Component {
  render = () => {
    const { domainId, userId } = this.props
    return (
      <Segment as={Container} basic>
        <Message negative>
          <Message.Header>
            You are not authorize to view this content!
          </Message.Header>
          <p>
            <Mutation mutation={ADD_PENDING_USER}>
              {(addPendingUser, { data, error }) => {
                return (
                  <Button
                    color="teal"
                    size="mini"
                    onClick={() =>
                      addPendingUser({ variables: { domainId, userId } })
                    }
                  >
                    Join Subscoreboard!
                  </Button>
                )
              }}
            </Mutation>
          </p>
        </Message>
      </Segment>
    )
  }
}

export default JoinScoreboard
