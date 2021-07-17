import React, { Component, Fragment } from "react"
import { /* Header, */ Icon, Item, Divider } from "semantic-ui-react"
import moment from "moment"
import PropTypes from "prop-types"
import "./VoteHistory.css"
import HistoryVoteExtra from "./HistoryVoteExtra"

class VoteHistory extends Component {
  static propTypes = {
    history: PropTypes.array.isRequired
  }

  static defaultProps = {
    history: []
  }

  render = () => {
    const { history } = this.props
    return (
      <Fragment>
        {/* <div className="root">
        <Header
          as="h1"
          style={{ fontSize: 14, paddingTop: 20, paddingLeft: 10 }}
        >
          Vote History
        </Header> */}
        {this.props.history.length === 0 ? (
          <div style={{ paddingBottom: 20 }}>
            <Divider />
            <span style={{ paddingTop: 20, paddingLeft: 10 }}>
              No vote history available
            </span>
          </div>
        ) : (
          <Item.Group
            divided
            style={{ overflow: "hidden auto", maxHeight: "120vh" }}
          >
            {history.reverse().map((vh, index) => (
              <Item
                key={index}
                style={{
                  backgroundColor:
                    vh.action === "upvote" ? "#dbefdc" : "#fdd9d7",
                  padding: "5px"
                }}
              >
                <Item.Content verticalAlign="bottom">
                  <Item.Description>
                    <Icon
                      name={vh.action === "upvote" ? "arrow up" : "arrow down"}
                    />
                    {vh.description}
                  </Item.Description>
                  <Item.Extra>
                    {/*{moment(vh.created).format("MMM DD, YYYY hh:mm:ss")}*/}
                    {moment(vh.created).fromNow()}
                  </Item.Extra>
                  <HistoryVoteExtra voteHistory={vh} />
                </Item.Content>
              </Item>
            ))}
          </Item.Group>
        )}
        {/* </div> */}
      </Fragment>
    )
  }
}

export default VoteHistory
