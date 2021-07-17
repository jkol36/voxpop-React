import React, { PureComponent } from "react"
import { List, Header, Segment } from "semantic-ui-react"
import PropTypes from "prop-types"

class FantasyLabel extends PureComponent {
  static propTypes = {
    fantasyLabels: PropTypes.array
  }

  renderFantasyLabels = () => {
    const { fantasyLabels } = this.props
    return (
      <List ordered relaxed>
        {fantasyLabels &&
          fantasyLabels.map(fantasyLabel => (
            <List.Item key={fantasyLabel.artist_id}>
              <List.Content>
                <List.Header>{fantasyLabel.name}</List.Header>
              </List.Content>
            </List.Item>
          ))}
      </List>
    )
  }

  render = () => {
    return (
      <div>
        <Header className="header-module" inverted attached="top" as="h4">
          Fantasy Label
        </Header>
        <Segment attached textAlign="left">
          {this.renderFantasyLabels()}
        </Segment>
      </div>
    )
  }
}

export default FantasyLabel
