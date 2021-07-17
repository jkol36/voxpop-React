import React, { PureComponent } from "react"
import { Header, Segment, Table } from "semantic-ui-react"
import PropTypes from "prop-types"
import _ from "lodash"
import moment from "moment"

class VoteLogs extends PureComponent {
  state = {
    column: null,
    userVoteLogs: [],
    direction: null
  }

  static propTypes = {
    userVoteLogs: PropTypes.array
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const _userVoteLogs = nextProps.userVoteLogs
    this.setState({ userVoteLogs: _userVoteLogs })
  }

  handleSort = clickedColumn => () => {
    const { column, userVoteLogs, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        userVoteLogs: _.sortBy(userVoteLogs, [clickedColumn]),
        direction: "ascending"
      })

      return
    }

    this.setState({
      userVoteLogs: userVoteLogs.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending"
    })
  }

  render = () => {
    const { column, userVoteLogs, direction } = this.state

    if (userVoteLogs && userVoteLogs.length > 0) {
      return (
        <div>
          <Header className="header-module" inverted attached="top" as="h4">
            Vote History
          </Header>
          <Segment attached textAlign="left">
            <Table sortable celled fixed>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    sorted={column === "created" ? direction : null}
                    onClick={this.handleSort("created")}
                  >
                    Date
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === "songTitle" ? direction : null}
                    onClick={this.handleSort("songTitle")}
                  >
                    Song Title
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === "songArtist" ? direction : null}
                    onClick={this.handleSort("songArtist")}
                  >
                    Song Artist
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === "description" ? direction : null}
                    onClick={this.handleSort("description")}
                  >
                    Text
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === "action" ? direction : null}
                    onClick={this.handleSort("action")}
                  >
                    Action
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === "tokens" ? direction : null}
                    onClick={this.handleSort("tokens")}
                  >
                    Tokens
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {_.map(
                  userVoteLogs,
                  ({
                    _id,
                    created,
                    songTitle,
                    songArtist,
                    description,
                    action,
                    tokens
                  }) => (
                    <Table.Row key={_id}>
                      <Table.Cell>
                        {moment(created)
                          .format("MMMM DD YYYY, h:mm:ss")
                          .toString()}
                      </Table.Cell>
                      <Table.Cell>{songTitle}</Table.Cell>
                      <Table.Cell>{songArtist}</Table.Cell>
                      <Table.Cell>{description}</Table.Cell>
                      <Table.Cell>{action}</Table.Cell>
                      <Table.Cell>{tokens}</Table.Cell>
                    </Table.Row>
                  )
                )}
              </Table.Body>
            </Table>
          </Segment>
        </div>
      )
    }
    return (
      <div>
        <Header className="header-module" inverted attached="top" as="h4">
          Vote History
        </Header>
        <Segment attached textAlign="left">
          <Header as="h4">
            <Header.Content>No vote logs available :)</Header.Content>
          </Header>
        </Segment>
      </div>
    )
  }
}

export default VoteLogs
