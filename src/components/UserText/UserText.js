import React, { Component } from "react"
import { List } from "semantic-ui-react"
import { Link, withRouter } from "react-router-dom"
import PropTypes from "prop-types"
import "./UserText.css"

class UserText extends Component {
  static propTypes = {
    texts: PropTypes.array.isRequired
  }

  static defaultProps = {
    texts: []
  }

  render = () => {
    return (
      <List divided relaxed>
        {this.props.texts.map(text => (
          <List.Item key={text.value}>
            <List.Icon name="content" size="large" verticalAlign="top" />
            <List.Content>
              <List.Header
                as={Link}
                to={`/boards/${text.domain}/content/${text.value}`}
              >
                {text.text}
              </List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    )
  }
}

export default withRouter(UserText)
