import React, { Component } from "react"
import {
  Segment,
  Container,
  Header,
  Item,
  Label,
  Button,
  Icon,
  Placeholder
} from "semantic-ui-react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { APP_TOKEN } from "../../utils/constants"
import moment from "moment"

const query = gql`
  query activities($limit: Int!, $offset: Int!) {
    activities(limit: $limit, offset: $offset) {
      _id
      event
      data
    }
  }
`

class ActivitiesStream extends Component {
  state = { offset: 0, limit: 3 }

  handlePageMove = (e, direction) => {
    this.setState(prev => ({
      offset: direction === "right" ? prev.offset + 1 : prev.offset - 1
    }))
  }

  renderStream = () => {
    const { limit, offset } = this.state
    return (
      <Query
        query={query}
        variables={{ limit, offset }}
        context={{ token: APP_TOKEN }}
      >
        {({ error, loading, data: { activities } }) => {
          if (error) return <div>{error.message}</div>
          if (loading)
            return (
              <div>
                <Placeholder fluid>
                  <Placeholder.Header>
                    <Placeholder.Line length="short" />
                    <Placeholder.Line length="medium" />
                    <Placeholder.Line length="short" />
                    <Placeholder.Line length="medium" />
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                </Placeholder>
              </div>
            )

          return (
            <div>
              {activities.map((act, index) => {
                switch (act.event) {
                  case "POSTED":
                    return (
                      <Item key={index}>
                        <Item.Content>
                          <Item.Header as="h6">
                            <Label color="teal">X / -Y</Label>
                            <Label color="grey">{`New Post: [${
                              act.data.title
                            }]`}</Label>
                          </Item.Header>
                          <Item.Description>
                            <Label color="teal">
                              {`[${act.data.title}] by [${
                                act.data.creator.name
                              }]`}
                            </Label>
                            <Label color="teal">
                              {moment(act.data.created).format("hh:mm:ss")}
                            </Label>
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    )
                  case "QUOTED":
                    return (
                      <Item key={index}>
                        <Item.Content>
                          <Item.Header as="h6">
                            <Label color="grey">{`["${
                              act.data.quote
                            }"]`}</Label>
                          </Item.Header>
                          <Item.Description>
                            <Label color="teal">{`[${
                              act.data.content.title
                            }] by [${act.data.creator.name}]`}</Label>
                            <Label color="teal">
                              {moment(act.data.created).format("hh:mm:ss")}
                            </Label>
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    )
                  case "VOTED":
                    return (
                      <Item key={index}>
                        <Item.Content>
                          <Item.Header as="h6">
                            <Label color="teal">{act.data.points}</Label>
                            <Label color="grey">{`${act.data.type.toUpperCase()}`}</Label>
                          </Item.Header>
                          <Item.Description>
                            <Label color="teal">{`[${
                              act.data.content.title
                            }] by [${act.data.creator.name}]`}</Label>
                            <Label color="teal">
                              {moment(act.data.created).format("hh:mm:ss")}
                            </Label>
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    )
                  case "COMMENTED":
                    return (
                      <Item key={index}>
                        <Item.Content>
                          <Item.Header as="h6">
                            <Label color="grey">{`New Comment: ["${
                              act.data.text
                            }"]`}</Label>
                          </Item.Header>
                          <Item.Description>
                            <Label color="teal">{`[${
                              act.data.content.title
                            }] by [${act.data.creator.name}]`}</Label>
                            <Label color="teal">
                              {moment(act.data.created).format("hh:mm:ss")}
                            </Label>
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    )
                  default:
                    break
                }
                return null
              })}
              {activities.length <= 0 && <div>No more activities</div>}
              {offset > 0 && (
                <Button
                  icon
                  labelPosition="left"
                  floated="left"
                  size="tiny"
                  onClick={e => this.handlePageMove(e, "left")}
                >
                  Prev
                  <Icon name="left arrow" />
                </Button>
              )}
              {activities.length > 0 && (
                <Button
                  icon
                  labelPosition="right"
                  floated="right"
                  size="tiny"
                  onClick={e => this.handlePageMove(e, "right")}
                >
                  Next
                  <Icon name="right arrow" />
                </Button>
              )}
            </div>
          )
        }}
      </Query>
    )
  }

  render = () => {
    return (
      <Segment as={Container}>
        <Header as="h1" style={{ fontStyle: 24 }}>
          Activities Stream
        </Header>
        <Segment basic>
          <Item.Group divided>{this.renderStream()}</Item.Group>
        </Segment>
      </Segment>
    )
  }
}

export default ActivitiesStream
