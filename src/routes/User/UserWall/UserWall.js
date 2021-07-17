import React, { PureComponent } from "react"
import { Feed, Header, Segment } from "semantic-ui-react"
import PropTypes from "prop-types"
import "./UserWall.css"

class UserWall extends PureComponent {
  static propTypes = {
    quotes: PropTypes.arrayOf(PropTypes.string)
  }

  renderQuotes = () => {
    const { quotes } = this.props

    if (quotes && quotes.length > 0) {
      return this.props.quotes.map((quote, index) => (
        <Feed className="userwall" key={index}>
          <Feed.Event>
            <Feed.Content>
              <strong>"</strong>
              <i>{quote}</i>
              <strong>"</strong>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      ))
    }
    return (
      <Header as="h4">
        <Header.Content>No quotes available :)</Header.Content>
        <Header.Subheader>
          Try sharing your favorite line from your favorite song
        </Header.Subheader>
      </Header>
    )
  }

  render = () => {
    return (
      <div>
        <Header className="header-module" inverted attached="top" as="h4">
          User Wall
        </Header>
        <Segment attached textAlign="center">
          {this.renderQuotes()}
        </Segment>
      </div>
    )
  }
}

export default UserWall
