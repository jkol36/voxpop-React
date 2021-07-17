import React, { Component } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  Container,
  Segment,
  Image,
  Button,
  Header,
  Icon
} from "semantic-ui-react"
import { Query } from "react-apollo"
import gql from "graphql-tag"

import { APP_TOKEN } from "../../utils/constants"
import hiphop from "../../assets/hiphop.png"

const getDomains = gql`
  query {
    domains(limit: 0) {
      _id
      title
      description
      url
      key
      created
    }
  }
`

class Domain extends Component {
  render = () => {
    return (
      <Segment as={Container} basic padded="very">
        <Segment inverted color="black">
          <Segment basic textAlign="center">
            <Header as="h2" icon inverted>
              <Icon name="sitemap" />
              Landing Area
              <Header.Subheader>Choose where you are going</Header.Subheader>
            </Header>
          </Segment>

          <Query query={getDomains} context={{ token: APP_TOKEN }}>
            {({ loading, error, data: { domains } }) => {
              if (loading) return "Loading..."
              if (error) return `Error: ${error.message}`

              return (
                <Card.Group itemsPerRow={1}>
                  {domains.map(domain => (
                    <Card key={domain.key} fluid>
                      <Card.Content>
                        <Image floated="left" size="tiny" src={hiphop} />
                        <Card.Header>{domain.title}</Card.Header>
                        <Card.Meta>{domain.description}</Card.Meta>
                      </Card.Content>
                      <Card.Content extra>
                        <Button
                          as={Link}
                          floated="right"
                          primary
                          to={"/" + domain.key}
                          fluid
                        >
                          {`Go to ${domain.key}`}
                        </Button>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Group>
              )
            }}
          </Query>
        </Segment>
      </Segment>
    )
  }
}

export default Domain
