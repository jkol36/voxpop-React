import React, { PureComponent, Fragment } from "react"
import { Input, Button, Popup, Label } from "semantic-ui-react"
import PropTypes from "prop-types"

import { CONTENT_REGEX } from "../../utils/parser"
class ActionPopup extends PureComponent {
  state = {
    isVoting: true,
    isCommenting: false,
    comment: "",
    orientation: this.props.orientation
  }

  static propTypes = {
    text: PropTypes.string,
    orientation: PropTypes.string,
    onAddComment: PropTypes.func,
    onShareQuote: PropTypes.func,
    onVote: PropTypes.func,
    onOrientationChange: PropTypes.func
  }

  static defaultProps = {
    orientation: "horizontal",
    onAddComment: () => {},
    onShareQuote: () => {},
    onVote: () => {},
    onOrientationChange: () => {}
  }

  componentDidMount = () => {
    this.setState({
      isCommenting: false,
      isVoting: true
    })
  }

  handleButtonClick = event => {
    const { name } = event.currentTarget
    if (name === "comment") {
      this.setState(prev => ({ isCommenting: !prev.isCommenting }))
    } else if (name === "flip") {
      const isHorizontal = this.state.orientation === "horizontal"
      this.setState(
        { orientation: isHorizontal ? "vertical" : "horizontal" },
        () => {
          this.props.onOrientationChange(event, this.state.orientation)
        }
      )
    } else {
      this.setState({ isVoting: false })
      this.props.onVote(event, {
        type: name,
        points: this.props.text.match(CONTENT_REGEX).length
      })
    }
  }

  handleAddComment = event => {
    this.props.onAddComment(event, this.state.comment)
    setTimeout(() => {
      this.setState({ isCommenting: false })
    }, 500)
  }

  handleCommentChange = (event, data) => {
    this.setState({ comment: data.value })
  }

  handleCancelComment = event => {
    this.setState({ isCommenting: false })
  }

  handleShareQuote = event => {
    this.props.onShareQuote(event, this.props.text)
  }

  renderScoreAndQuotes = () => (
    <Fragment>
      <Button inverted>{`${this.props.text.split(/\s+/g).length}`}</Button>
      <Button
        name="comment"
        inverted
        icon="circle"
        onClick={this.handleButtonClick}
      />
      <Popup
        trigger={
          <Button icon="quote right" inverted onClick={this.handleShareQuote} />
        }
        on="click"
        content="Shared on your wall"
        hideOnScroll
      />
    </Fragment>
  )

  renderButtons = () => (
    <div
      style={{
        display: "flex",
        flexDirection:
          this.props.orientation === "horizontal" ? "row" : "column"
      }}
    >
      <Button
        color="green"
        inverted
        icon="plus"
        name="upvote"
        onClick={this.handleButtonClick}
      />
      <Button
        name="comment"
        inverted
        icon="circle"
        onClick={this.handleButtonClick}
      />
      <Button
        color="red"
        inverted
        icon="minus"
        name="downvote"
        onClick={this.handleButtonClick}
      />
      <Button
        color="grey"
        inverted
        icon="undo"
        name="flip"
        onClick={this.handleButtonClick}
      />
    </div>
  )

  renderCommentBox = () => (
    <Input
      action={
        <Fragment>
          <Button color="green" icon="plus" onClick={this.handleAddComment} />
          <Button color="red" icon="close" onClick={this.handleCancelComment} />
        </Fragment>
      }
      placeholder="Write your comment..."
      onChange={this.handleCommentChange}
    />
  )

  renderPopover = () => {
    if (this.state.isCommenting) {
      return this.renderCommentBox()
    } else {
      if (this.state.isVoting) {
        return this.renderButtons()
      }
      return this.renderScoreAndQuotes()
    }
  }

  render = () => {
    return (
      <Label pointing="below" color="black">
        {this.renderPopover()}
      </Label>
    )
  }
}

export default ActionPopup
