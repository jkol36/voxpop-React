import React, { Component, Fragment } from "react"
import { Container, Dimmer, Loader, Placeholder } from "semantic-ui-react"
import PropTypes from "prop-types"

import SelectionPopover from "./SelectionPopover"
import ContentPanel from "../ContentPanel/ContentPanel"
import { parser } from "../../utils/parser"

import "./VotingBoard.css"

class VotingBoard extends Component {
  state = { open: false, selection: {} }

  static propTypes = {
    title: PropTypes.string,
    created: PropTypes.string,
    highlights: PropTypes.arrayOf(
      PropTypes.shape({
        startIndex: PropTypes.number,
        endIndex: PropTypes.number,
        id: PropTypes.string
      })
    ),
    score: PropTypes.shape({
      upvotes: PropTypes.number,
      downvotes: PropTypes.number
    }),
    topOffset: PropTypes.number,
    content: PropTypes.string.isRequired,
    children: PropTypes.func,
    loading: PropTypes.bool,
    userContentChatRoom: PropTypes.object,
    contentId: PropTypes.string
  }

  static defaultProps = {
    title: "Voting Board",
    topOffset: 60
  }

  handleSelect = select => {
    const text = select.toString()

    if (!text) return
    const selection = parser(this.props.content, text)

    if (text.length > 0 && this.props.onSelect) {
      this.setState({ open: true, selection })
      this.props.onSelect(selection)
    } else {
      this.setState({ selection: {} })
    }
  }

  handleDeselect = select => {
    this.setState({ open: false })
  }

  renderHighlights = () => {
    if (this.props.highlights) {
      return this.props.content.split(/\n/g).map(line => (
        <Fragment>
          {line.split(/\s+/g).map((word, index) => (
            <span key={index + word}>{word + " "}</span>
          ))}
          <br />
        </Fragment>
      ))
    }
    return this.props.content
  }

  renderLoader = () => (
    <Dimmer active>
      <Loader size="small">Loading Lyrics</Loader>
    </Dimmer>
  )

  renderContent = () => {
    if (!this.props.content) return null
    return (
      <Container style={{ position: "relative" }}>
        <div data-selectable>
          <p className="voting_board-content">{this.renderHighlights()}</p>
        </div>
        <SelectionPopover
          showPopover={this.state.open}
          topOffset={this.props.topOffset}
          onSelect={this.handleSelect}
          onDeselect={this.handleDeselect}
        >
          {this.props.children({ ...this.state.selection })}
        </SelectionPopover>
      </Container>
    )
  }

  render = () => {
    const { loading } = this.props
    if (loading) {
      return (
        <div style={{ margin: 25 }}>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
            <Placeholder.Paragraph>
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        </div>
      )
    }
    return (
      <ContentPanel created={this.created} {...this.props}>
        {this.renderContent() || this.renderLoader()}
      </ContentPanel>
    )
  }
}

export default VotingBoard
