import React, { Component, Fragment } from "react"
import { Header, Icon, Image, Label, Placeholder } from "semantic-ui-react"
import PropTypes from "prop-types"
import "./CreatorPanel.css"

class CreatorPanel extends Component {
  static propTypes = {
    creator: PropTypes.string,
    score: PropTypes.shape({
      upvotes: PropTypes.number,
      downvotes: PropTypes.number
    }),
    image: PropTypes.string,
    enableFollow: PropTypes.bool,
    loading: PropTypes.bool
  }

  static defaultProps = {
    creator: "Unknown Creator",
    score: {
      upvotes: 0,
      downvotes: 0
    },
    image:
      "https://www.vccircle.com/wp-content/uploads/2017/03/default-profile.png",
    enableFollow: false
  }

  renderInformation = () => {
    const { enableFollow, creator, score, loading } = this.props
    if (loading) {
      return (
        <Fragment>
          <div className="user-info">
            <Placeholder>
              <Placeholder.Header image />
            </Placeholder>
          </div>
        </Fragment>
      )
    }

    if (enableFollow) {
      const scoreValues = `# ${score.upvotes - score.downvotes}`
      return (
        <Fragment>
          <div className="user-info">
            <div
              style={{
                fontSize: 36,
                marginTop: 20,
                color: "white",
                fontFamily: "Raleway, sans-serif",
                textAlign: "right"
              }}
            >
              {creator}
            </div>
            <div
              style={{
                fontFamily: "Raleway, sans-serif",
                marginTop: 5,
                textAlign: "right"
              }}
            >
              <small>Hiphop Scoreboard</small>
            </div>

            <Label circular color="black">
              {scoreValues}
            </Label>
            <div className="user-header-votes">
              <span style={{ color: "darkgreen", margin: 5 }}>
                +{score.upvotes}
              </span>
              <span style={{ color: "darkred", margin: 5 }}>
                {" "}
                -{score.downvotes}
              </span>
            </div>

            <Icon
              style={{ marginLeft: "10px" }}
              color="white"
              name="user plus"
              size="small"
            />
          </div>
        </Fragment>
      )
    }

    return (
      <Header style={{ fontSize: 26, marginTop: 0 }}>
        {creator}
        <Header.Subheader style={{ fontSize: 22 }}>
          {`Score ${score.upvotes - score.downvotes} (${score.upvotes} / -${
            score.downvotes
          })`}
        </Header.Subheader>
      </Header>
    )
  }

  render = () => {
    const { image, loading } = this.props
    return (
      <React.Fragment>
        <div className="user-content-header vertical-align">
          <div className="image-div">
            {loading ? (
              <Placeholder>
                <Placeholder.Image className="image-wrapper" />
              </Placeholder>
            ) : (
              <Image src={image} className="image-wrapper" />
            )}
          </div>
          {this.renderInformation()}
        </div>
        <div className="user-content-title">User Content</div>
      </React.Fragment>
    )
  }
}

export default CreatorPanel
