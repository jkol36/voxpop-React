import React, { Component } from "react"
import { List } from "semantic-ui-react"
import moment from "moment"

import Section from "../../components/Layouts/Section/Section"
import PropTypes from "prop-types"

const sortByCreatedDate = (a, b) => {
  const d1 = moment(a.created)
  const d2 = moment(b.created)
  if (d1.isBefore(d2)) return 1
  if (d1.isAfter(d2)) return -1
  return 0
}

class Comments extends Component {
  static propTypes = {
    comments: PropTypes.array
  }

  handleItemSelect = ({ comment }, event) => {
    const selection = window.getSelection()
    const paragraph = document.querySelector("p.voting_board-content")
    const node = document.createTextNode(paragraph.innerText)
    paragraph.appendChild(node)
    selection.setBaseAndExtent(node, comment.startIndex, node, comment.endIndex)
    paragraph.removeChild(paragraph.firstChild)
  }

  render = () => {
    const sortedComments = [...this.props.comments]
    sortedComments.sort(sortByCreatedDate)
    if (!this.props.comments) {
      return <div>Loading...</div>
    }
    return (
      <Section title="Comments">
        <List animated verticalAlign="middle">
          {sortedComments.map((comment, index) => {
            const { content, songId, artistId, created } = comment
            return (
              <List.Item key={index}>
                <List.Content>
                  <List.Header
                    as="a"
                    onClick={e =>
                      this.handleItemSelect({ songId, artistId, comment }, e)
                    }
                  >
                    {content}
                  </List.Header>
                  <List.Description>
                    {moment(created).format("ddd, MMM Do YY")}
                  </List.Description>
                </List.Content>
              </List.Item>
            )
          })}
        </List>
      </Section>
    )
  }
}

export default Comments
