import React, { Component } from "react"
import { Button, Item } from "semantic-ui-react"
import PropTypes from "prop-types"

class HistoryVoteExtra extends Component {
  state = {
    viewDetails: false
  }

  static propTypes = {
    voteHistory: PropTypes.object
  }

  static defaultProps = {
    voteHistory: []
  }

  handleClick = event => {
    this.setState({ viewDetails: true })
  }

  renderViewDetails = () => {
    const { voteHistory } = this.props
    const tokens =
      voteHistory.action === "upvote"
        ? `+${voteHistory.tokens}`
        : `-${voteHistory.tokens}`
    if (voteHistory.action === "upvote") {
      return (
        <React.Fragment>
          <Item.Extra>
            <small style={{ float: "right" }}>
              {`[${voteHistory.title}] by [${voteHistory.author}] ${tokens}`}
            </small>
          </Item.Extra>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <Item.Extra>
          <Button floated="right" color="red">
            {tokens}
          </Button>
        </Item.Extra>
        <Item.Extra>
          <small style={{ float: "right" }}>
            {`[${voteHistory.title}] by [${voteHistory.author}]`}
          </small>
        </Item.Extra>
      </React.Fragment>
    )
  }

  render = () => {
    const { viewDetails } = this.state
    const { voteHistory } = this.props
    return (
      <React.Fragment>
        {viewDetails ? (
          this.renderViewDetails()
        ) : (
          <Item.Extra>
            <Button
              floated="right"
              circular
              color={voteHistory.action === "upvote" ? "green" : "red"}
              icon="question"
              onClick={this.handleClick}
            />
          </Item.Extra>
        )}
      </React.Fragment>
    )
  }
}

export default HistoryVoteExtra
