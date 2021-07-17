import React, { Component } from "react"
import PropTypes from "prop-types"
import "./FlipCard.css"

const animateFlip = (index, current, prev) => {
  return current[index] !== prev[index] ? "play" : "pause"
}

class FlipCard extends Component {
  static propTypes = {
    content: PropTypes.string
  }

  state = {
    content: this.props.content,
    prevContent: this.props.content
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    this.setState(prev => ({ prevContent: prev.content }))
    if (nextProps.content !== this.state.content) {
      setTimeout(() => {
        this.setState({ content: nextProps.content })
      }, 100)
    }
  }

  render() {
    const { content, prevContent } = this.state
    const flipContainerStyle = {
      width: `${this.props.width}px`,
      height: `${this.props.height}px`
    }

    const innerStyle = {
      backgroundColor: this.props.color,
      fontSize: `${this.props.fontSize}px`
    }

    let wrapperStyle = {
      margin: "0px"
    }
    wrapperStyle = this.props.float
      ? { ...wrapperStyle, float: this.props.float }
      : wrapperStyle

    return (
      <div className="flip-clock-small-wrapper" style={wrapperStyle}>
        {content.length > 0 &&
          content.split("").map((ch, index) => (
            <ul
              key={index}
              className={animateFlip(index, content, prevContent)}
              style={flipContainerStyle}
            >
              <li className="flip-clock-before">
                <a>
                  <div className="up">
                    <div className="shadow" />
                    <div className="inn" style={innerStyle}>
                      {prevContent[index] || ch}
                    </div>
                  </div>
                  <div className="down">
                    <div className="shadow" />
                    <div className="inn" style={innerStyle}>
                      {prevContent[index] || ch}
                    </div>
                  </div>
                </a>
              </li>
              <li className="flip-clock-active">
                <a>
                  <div className="up">
                    <div className="shadow" />
                    <div className="inn" style={innerStyle}>
                      {ch}
                    </div>
                  </div>
                  <div className="down">
                    <div className="shadow" />
                    <div className="inn" style={innerStyle}>
                      {ch}
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          ))}
      </div>
    )
  }
}

export default FlipCard
