import React, { Component } from "react"
import { Grid, Pagination, Placeholder, Segment, Icon } from "semantic-ui-react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import moment from "moment"
import ReadMoreReact from "read-more-react"
import { APP_TOKEN } from "../../utils/constants"

import "./TopContents.css"
import PropTypes from "prop-types"
// import ContentModal from "./ContentModal"

const query = gql`
  query paginate($page: PaginationInput!) {
    paginate(page: $page) {
      total
      data
    }
  }
`

const PostsRows = props => (
  <div className="activity-rows">
    <Grid>
      <Grid.Column width={1} className="top-content-row" floated="right">
        <h1>#{props.rank}</h1>
      </Grid.Column>
      <Grid.Column width={14}>
        <fieldset style={{ borderColor: props.color }}>
          <legend className="legend" style={{ color: props.color }}>
            Submitted by {props.contentCreator}{" "}
            {moment(props.dateCreated).fromNow()}
          </legend>
          <Grid>
            <Grid.Column width={14}>
              <div className="top-post-title">
                <Icon link name="add circle" size="large" />{" "}
                <strong>{props.title}</strong>
              </div>
              <ReadMoreReact
                text={props.text}
                min={300}
                ideal={300}
                max={500}
                readMoreText={"read more..."}
              />
            </Grid.Column>
            <Grid.Column float="right" width={2}>
              <strong className="activityScoreUp">+{props.upvotes}</strong>{" "}
              <strong className="activityScore"> / </strong>
              <strong className="activityScoreDown">-{props.downvotes}</strong>
            </Grid.Column>
          </Grid>
        </fieldset>
      </Grid.Column>
      <Grid.Column
        width={1}
        className="top-content-row-margin"
        style={{ padding: 0 }}
      >
        <Icon link name="bookmark" size="large" />
        <Icon link name="sign-out alternate" size="large" />
      </Grid.Column>
    </Grid>
  </div>
)

class TopContents extends Component {
  state = { page: 1, limit: 5 }

  handlePageChange = (event, { activePage }, total) => {
    if (this.state.page + 1 < total) this.setState({ page: activePage })
  }

  renderNoData = (
    <div className="top-contents-section">
      <Segment basic>No available contents</Segment>
    </div>
  )

  render = () => {
    const { page, limit } = this.state
    const { pageFilter } = this.props
    return (
      <Query
        query={query}
        variables={{
          page: {
            page,
            limit,
            type: "Content",
            ...pageFilter
          }
        }}
        context={{ token: APP_TOKEN }}
      >
        {({ error, loading, data }) => {
          if (error) {
            return this.renderNoData
          }
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
          /* return (
            <div className="top-contents-section">
              <h5>Top Contents</h5>
              <hr />
              <Grid>
                <Grid.Row>
                  <Grid.Column width={2}>
                    <Placeholder className="top-content-number-column" />
                  </Grid.Column>
                  <Grid.Column width={14}>
                    <div className="top-content">
                      <div className="top-content-text">
                        <br />
                        <p>
                          <Placeholder>
                            <Placeholder.Line length="short" />
                            <Placeholder.Line length="medium" />
                            <Placeholder.Line length="long" />
                            <Placeholder.Line length="very long" />
                            <Placeholder.Line length="very long" />
                            <Placeholder.Line length="very long" />
                            <Placeholder.Line length="long" />
                            <Placeholder.Line length="very long" />
                            <Placeholder.Line length="long" />
                          </Placeholder>
                        </p>
                      </div>
                      <div className="top-content-text-info">
                        <Placeholder>
                          <Placeholder.Line length="full" />
                        </Placeholder>
                      </div>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          ) */

          const { paginate } = data
          console.log({ paginate })
          if (!paginate.data.length) return this.renderNoData
          return (
            <Segment style={{ margin: "0px" }}>
              <div style={{ padding: "10px 25px 25px 25px" }}>
                {paginate.data.map((content, index) => {
                  const rank = (page - 1) * 5 + index + 1
                  let firstDigit = rank
                    .toString()
                    .split("")
                    .pop()
                  let color
                  const ranking = ["6", "7", "8", "9", "0"]
                  ranking.forEach((num, index) => {
                    if (num === firstDigit) firstDigit = (index + 1).toString()
                  })
                  switch (firstDigit) {
                    case "1":
                      color = "#0A054A"
                      break
                    case "2":
                      color = "#02D57C"
                      break
                    case "3":
                      color = "#F8B300"
                      break
                    case "4":
                      color = "#6200EE"
                      break
                    case "5":
                      color = "#0094FF"
                      break
                    default:
                      color = ""
                      break
                  }
                  return (
                    <PostsRows
                      key={index}
                      rank={rank}
                      contentCreator={content.creator.name}
                      color={color}
                      dateCreated={content.created}
                      upvotes={content.scoreDetails.upvotes}
                      downvotes={content.scoreDetails.downvotes}
                      text={content.text}
                      page={page}
                      title={content.title}
                    />
                  )
                })}
                <br />
                <center>
                  <Pagination
                    defaultActivePage={1}
                    activePage={page}
                    totalPages={paginate.total / limit}
                    onPageChange={(e, data) =>
                      this.handlePageChange(e, data, paginate.total / limit)
                    }
                  />
                </center>
              </div>
            </Segment>
          )

          /* return (
            <div className="top-contents-section">
              {paginate.data.map((content, index) => (
                <Grid key={index}>
                  <Grid.Row>
                    <Grid.Column
                      width={2}
                      className="top-content-number-column"
                    >
                      <h1>
                        <sup>#</sup>
                        {(page - 1) * 5 + index + 1}
                      </h1>
                    </Grid.Column>
                    <Grid.Column width={14}>
                      <div className="top-content">
                        <div className="top-content-text">
                          <div className="votes">
                            <div className="upvotes">
                              +{content.scoreDetails.upvotes}
                            </div>
                            <div className="downvotes" role="alert">
                              -{content.scoreDetails.downvotes}
                            </div>
                          </div>
                          <br />
                          <ReadMoreReact
                            text={content.text}
                            min={300}
                            ideal={300}
                            max={500}
                            readMoreText={"[read more]"}
                          />
                        </div>
                        <div className="top-content-text-info">
                          <Grid.Row>
                            <Grid.Column>
                              <small>
                                <ContentModal content={content} />
                                &nbsp; by{" "}
                                {content.creator
                                  ? content.creator.name
                                  : "Unknown Author"}{" "}
                              </small>
                            </Grid.Column>
                          </Grid.Row>
                        </div>
                        <div className="top-content-stamps">
                          <div className="top-content-date-stamp">
                            <i className="fas fa-clock" />
                            <small>
                              &nbsp;&nbsp;
                              {moment(content.created).format(
                                "MMM DD, YYYY hh:mm:ss"
                              )}
                            </small>
                          </div>
                          <div className="top-content-icon-stamps">
                            <i className="fa fa-heart" />
                            &nbsp;
                            <i className="fab fa-facebook" />
                            &nbsp;
                            <i className="fas fa-quote-right" />
                            &nbsp;
                          </div>
                        </div>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              ))}
              <br />
              <center>
                <Pagination
                  defaultActivePage={1}
                  activePage={page}
                  totalPages={paginate.total / limit}
                  onPageChange={(e, data) =>
                    this.handlePageChange(e, data, paginate.total / limit)
                  }
                />
              </center>
            </div>
          ) */
        }}
      </Query>
    )
  }
}

TopContents.propTypes = {
  pageFilter: PropTypes.object.isRequired
}

export default TopContents
