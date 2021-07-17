import React, { Component } from "react"
import {
  Segment,
  Header,
  Icon,
  Input,
  Grid,
  Button,
  Placeholder
} from "semantic-ui-react"
import "./ActivityFeed.css"
import { Query } from "react-apollo"
import { APP_TOKEN } from "../../utils/constants"
import moment from "moment"
import gql from "graphql-tag"

const query = gql`
  query activities($limit: Int!, $offset: Int!) {
    activities(limit: $limit, offset: $offset) {
      _id
      event
      data
    }
  }
`

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function formatContentDate(sDate) {
  const a = moment.utc()
  const b = moment.utc(sDate)
  const dateDiff = a.diff(b, "days")
  console.log({ a, b, dateDiff })
  if (dateDiff <= 1) {
    return moment(sDate)
      .calendar()
      .toString()
      .replace("at", "@")
  }

  return moment(sDate).format("MMM Do")
}

const ActivityRows = props => (
  <div className="activity-rows">
    <Grid>
      <Grid.Column width={1} className="period" floated="right">
        <strong>{props.dateCreated}</strong>
      </Grid.Column>
      <Grid.Column width={13}>
        <fieldset style={{ borderColor: props.color }}>
          <legend className="legend" style={{ color: props.color }}>
            {props.event} by {props.name}
          </legend>
          <Grid>
            <Grid.Column width={13}>
              <p
                className={
                  props.event === "quoted"
                    ? "activityContentsQoute"
                    : "activityContents"
                }
              >
                {props.content}
              </p>
            </Grid.Column>
            <Grid.Column float="right" width={3}>
              <strong className="activityScoreUp">+{getRandomInt(1000)}</strong>{" "}
              <strong className="activityScore"> / </strong>
              <strong className="activityScoreDown">
                -{getRandomInt(1000)}
              </strong>
            </Grid.Column>
          </Grid>
        </fieldset>
      </Grid.Column>
      <Grid.Column width={2} className="row-margin">
        <Icon link name="bookmark" size="large" />
        <Icon link name="sign-out alternate" size="large" />
      </Grid.Column>
    </Grid>
  </div>
)

class ActivityFeed extends Component {
  state = { offset: 0, limit: 5 }

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
              <Segment style={{ margin: "0px" }} loading>
                <Placeholder fluid>
                  <Placeholder.Header>
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                  <Placeholder.Header>
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                  <Placeholder.Header>
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                </Placeholder>
              </Segment>
            )

          return (
            <Segment style={{ margin: "0px" }}>
              <div style={{ padding: "10px 25px 25px 25px" }}>
                {activities.map((act, index) => {
                  const dateCreated = formatContentDate(act.data.created)
                  switch (act.event) {
                    case "POSTED":
                      return (
                        <ActivityRows
                          key={index}
                          id={act.data._id}
                          content={act.data.title}
                          color="#0A054A"
                          dateCreated={dateCreated}
                          points={act.data.score}
                          name={act.data.creator.name}
                          event={act.event.toLowerCase()}
                        />
                      )
                    case "QUOTED":
                      return (
                        <ActivityRows
                          key={index}
                          id={act.data._id}
                          content={`"${act.data.quote}"`}
                          color="#0094FF"
                          dateCreated={dateCreated}
                          points="0"
                          name={act.data.creator.name}
                          event={act.event.toLowerCase()}
                        />
                      )
                    case "VOTED":
                      return (
                        <ActivityRows
                          key={index}
                          id={act.data._id}
                          content={act.data.content.title}
                          color="#02D57C"
                          dateCreated={dateCreated}
                          points={act.data.points}
                          name={act.data.creator.name}
                          event={act.event.toLowerCase()}
                        />
                      )
                    case "COMMENTED":
                      return (
                        <ActivityRows
                          key={index}
                          id={act.data._id}
                          content={act.data.text}
                          color="#F8B300"
                          dateCreated={dateCreated}
                          points={act.data.content.score}
                          name={act.data.creator.name}
                          event={act.event.toLowerCase()}
                        />
                      )
                    default:
                      break
                  }
                  return null
                })}
                {activities.length <= 0 && <div>No more activities</div>}
                <div style={{ marginTop: "5px" }}>
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
              </div>
            </Segment>
          )
        }}
      </Query>
    )
  }

  render() {
    return (
      <div>
        <div className="activity">
          <Header className="textFont" size="large" textAlign="center" inverted>
            Activity Feed
          </Header>
          <div style={{ marginTop: "-45px" }}>
            <Icon link name="calendar" size="big" inverted />
            <Icon link name="filter" size="big" inverted />
            <Input icon="search" placeholder="Search..." />
          </div>
        </div>
        {this.renderStream()}
      </div>
    )
  }
}

export default ActivityFeed
