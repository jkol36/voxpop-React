import React, { Component } from "react"
import { Menu, Placeholder } from "semantic-ui-react"
import gql from "graphql-tag"
import { Query } from "react-apollo"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

const USER_CONTENTS_QUERY = gql`
  query userContents($creatorId: String!) {
    user(creatorId: $creatorId) {
      contents {
        _id
        text
        title
        domain {
          key
        }
      }
    }
  }
`

class Contents extends Component {
  static propTypes = {
    creatorId: PropTypes.string,
    contentId: PropTypes.string,
    loading: PropTypes.bool
  }

  renderLoading = () => {
    return (
      <div style={{ margin: 25 }}>
        <Placeholder>
          <Placeholder.Paragraph>
            <Placeholder.Line />
          </Placeholder.Paragraph>
          <Placeholder.Paragraph>
            <Placeholder.Line />
          </Placeholder.Paragraph>
          <Placeholder.Paragraph>
            <Placeholder.Line />
          </Placeholder.Paragraph>
          <Placeholder.Paragraph>
            <Placeholder.Line />
          </Placeholder.Paragraph>
          <Placeholder.Paragraph>
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </div>
    )
  }

  render() {
    const { creatorId, contentId, loading } = this.props
    const variables = { creatorId }

    if (loading) {
      return this.renderLoading()
    }

    return (
      <Query query={USER_CONTENTS_QUERY} variables={variables}>
        {({ loading, error, data }) => {
          if (loading) return this.renderLoading()
          if (error) return <div>{`Error: ${error}`}</div>
          const { contents } = data.user

          return (
            <Menu pointing secondary vertical>
              {contents.map(content => {
                const { _id, domain, title } = content
                return (
                  <React.Fragment>
                    <Menu.Item
                      name={title}
                      active={contentId === _id}
                      as={Link}
                      to={`/boards/${domain.key}/content/${_id}`}
                    />
                  </React.Fragment>
                )
              })}
            </Menu>
          )
        }}
      </Query>
    )
  }
}

export default Contents
