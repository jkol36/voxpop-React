import React, { Component } from "react"
import styles from "./VotingPopup.module.css"
import FontAwesome from "react-fontawesome"
import { Input, Button, Popup } from "semantic-ui-react"
import { CONTENT_REGEX } from "../../../utils/parser"

export default class VotingPopup extends Component {
  state = {
    expand: false,
    greenValue: "",
    yellowValue: "",
    redValue: "",
    purpleValue: "",
    comment: "",
    commentSubmitted: false
  }

  componentDidMount() {
    const selectionPopover = document.querySelector("#popButtons")
    selectionPopover.addEventListener("mousedown", e => {
      e.preventDefault()
    })
  }

  // Handle the upvote or downvote
  handleVote = (type, event) => {
    this.props.onVote(event, {
      type,
      points: this.props.text.match(CONTENT_REGEX).length
    })
  }

  // Handle sharing quote
  handleShareQuote(event) {
    this.props.onShareQuote(event, this.props.text)
  }

  // Gets the value of the users comment when they enter any value
  handleOnChange = (e, comment) => {
    this.setState({ comment })
  }

  // A method to save or do whatever with the users comment
  handleAddComment = event => {
    this.props.onAddComment(event, this.state.comment.value)
    /* setTimeout(() => {
		  this.setState({ isCommenting: false })
		}, 500) */
    this.resetState()
  }

  resetState() {
    this.setState({
      greenValue: "",
      yellowValue: "",
      redValue: "",
      purpleValue: "",
      comment: "",
      expand: false,
      commentSubmitted: false
    })
  }

  // options are 'expand' and 'default'
  toggleAnimationState(event, state) {
    let expand = state === "expand" ? true : false
    this.setState({ expand })
  }

  render() {
    const { expand } = this.state
    return (
      <div
        className={`${styles["light-container"]} ${
          expand ? styles["expand"] : ""
        } `}
        /* onMouseLeave={ () => this.toggleAnimationState('default') } */
      >
        <div id="popButtons" className={styles["light-container-inner"]}>
          <div
            className={`${styles["light-inner"]} ${styles["vertical-align"]} `}
          >
            {/* Green Button */}
            <Popup
              trigger={
                <div
                  className={`${styles["light-circ"]}  ${styles["c1"]}`}
                  onClick={this.handleVote.bind(this, "upvote")}
                >
                  <FontAwesome
                    className={` ${styles["overwrite-fas"]} ${styles["fas"]}`}
                    name="arrow-up"
                    size="2x"
                  />
                  <div className={styles["c1i"]} />
                </div>
              }
              on="click"
              content="Upvote"
              hideOnScroll
            />

            {/* Yellow Button */}
            <div
              className={`${styles["light-circ"]} ${styles["c2"]}`}
              onClick={e => {
                this.toggleAnimationState(e, "expand")
              }}
            >
              <FontAwesome
                className={`${styles["overwrite-fas"]} ${styles["fas"]}`}
                name="chevron-circle-down"
                size="2x"
              />
              <div className={styles["c2i"]} />
            </div>

            {/* Red Button */}
            <Popup
              trigger={
                <div
                  className={`${styles["light-circ"]} ${styles["c3"]}`}
                  onClick={this.handleVote.bind(this, "downvote")}
                >
                  <FontAwesome
                    className={`${styles["overwrite-fas"]} ${styles["fas"]}`}
                    name="arrow-down"
                    size="2x"
                  />
                  <div className={styles["c3i"]} />
                </div>
              }
              on="click"
              content="Downvote"
              hideOnScroll
            />

            {/* Purple Button */}
            <Popup
              trigger={
                <div
                  className={`${styles["light-circ"]} ${styles["c4"]}  ${
                    expand ? styles["show-quotes-option"] : ""
                  } `}
                  onClick={this.handleShareQuote.bind(this)}
                >
                  <FontAwesome
                    className={`${styles["overwrite-fas"]} ${styles["fas"]}`}
                    name="quote-right"
                    size="2x"
                  />
                  <div className={styles["c4i"]} />
                </div>
              }
              on="click"
              content="Shared on your wall"
              hideOnScroll
            />
          </div>
        </div>

        {/* Comment input and save Button */}
        <div className={`${styles["cmt"]} ${expand ? styles["show-cmt"] : ""}`}>
          <div className="ui action input">
            <Input type="text" onChange={this.handleOnChange} action />
            <Button
              basic
              color="grey"
              content={
                <FontAwesome className={styles["fas"]} name="comment-alt" />
              }
              onClick={this.handleAddComment}
            />
          </div>
        </div>
      </div>
    )
  }
}
