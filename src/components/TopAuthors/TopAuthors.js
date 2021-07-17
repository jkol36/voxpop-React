import React, { Component } from "react"
import { connect } from "react-redux"
import { Grid, Header, Image, Segment, Placeholder } from "semantic-ui-react"
import { Query } from "react-apollo"
import { APP_TOKEN } from "../../utils/constants"
import gql from "graphql-tag"

import defaultImage from "../../assets/user_default.png"

import "./TopAuthors.css"

const query = gql`
  query paginate($page: PaginationInput!) {
    paginate(page: $page) {
      total
      data
    }
  }
`

class TopAuthors extends Component {
  state = { page: 1, limit: 5 }

  handlePageChange = (event, { page }, total) => {
    if (this.state.page + 1 < total) this.setState({ page })
  }

  render = () => {
    const { page, limit } = this.state
    const searchTerm = this.props.searchTerm

    return (
      <Query
        query={query}
        variables={{
          page: {
            page,
            limit,
            sort: "DESC",
            type: "Creator",
            searchTerm: searchTerm
          }
        }}
        context={{ token: APP_TOKEN }}
      >
        {({ loading, error, data }) => {
          if (error)
            return (
              <Segment>
                <Header as="h1" style={{ fontSize: 24 }}>
                  Top Authors
                </Header>
                <Segment basic>Creators not available</Segment>
              </Segment>
            )
          if (loading)
            return (
              <div className="top-authors-section">
                <h5>Top Authors</h5>
                <hr />
                <Grid>
                  <Grid.Row columns={2} stretched className="top-author-row">
                    <Grid.Column width={14} className="name-column">
                      <p>Author's Name</p>
                      <Placeholder>
                        <Placeholder.Line />
                      </Placeholder>
                    </Grid.Column>
                    <Grid.Column width={2} className="image-column">
                      <Placeholder>
                        <Placeholder.Image />
                      </Placeholder>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className="half-circle-row">
                    <div className="half-circle">-</div>
                  </Grid.Row>
                  <center>
                    <hr />
                  </center>
                </Grid>
              </div>
            )

          const { paginate } = data

          return (
            <div className="top-authors-section">
              <h5>Top Authors</h5>
              <hr />
              {paginate.data.map((item, index) => (
                <Grid key={index}>
                  <Grid.Row columns={2} stretched className="top-author-row">
                    <Grid.Column width={14} className="name-column">
                      <p>{item.name}</p>
                      <small className="votes">
                        <b>
                          <span className="upvotes">
                            <i className="fas fa-arrow-up" />
                            {item.scoreDetails.upvotes}
                          </span>
                          <span className="downvotes">
                            <i className="fas fa-arrow-down" />
                            {item.scoreDetails.downvotes}
                          </span>
                        </b>
                      </small>
                    </Grid.Column>
                    <Grid.Column width={2} className="image-column">
                      <Image
                        src={item.profileImageUrl || defaultImage}
                        width={50}
                        height={50}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className="half-circle-row">
                    <div className="half-circle">{index + 1}</div>
                  </Grid.Row>
                  <center>
                    <hr />
                  </center>
                </Grid>
              ))}
            </div>
          )
        }}
      </Query>
    )
  }
}
const mapStateToProps = ({ filterContent }) => {
  console.log("filterContent printing")
  console.log(filterContent)
  return {
    searchTerm: filterContent.searchTerm
  }
}

export default connect(mapStateToProps)(TopAuthors)
