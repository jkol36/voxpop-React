import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Dropdown, Image, Button } from "semantic-ui-react"
import { connect } from "react-redux"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import hiphop from "../../assets/hiphop.png"
import { APP_TOKEN } from "../../utils/constants"

const getDomains = gql`
  query {
    domains(limit: 0) {
      title
      key
    }
  }
`

class DomainDropdown extends Component {
  handleItemClick = event => {
    window.location.reload()
  }

  render = () => {
    return (
      <Query query={getDomains} context={{ token: APP_TOKEN }}>
        {({ loading, error, data: { domains } }) => {
          if (loading) return "Loading..."
          if (error) return "Error"

          return (
            <Dropdown
              fluid
              floating
              item
              text={<Image src={hiphop} size="huge" />}
            >
              <Dropdown.Menu>
                <Dropdown.Header>
                  <Button
                    as={Link}
                    to={this.props.url + "/create-scoreboard"}
                    color="teal"
                  >
                    Create new scoreboard
                  </Button>
                </Dropdown.Header>
                <Dropdown.Divider />
                {domains.map((domain, index) => (
                  <Dropdown.Item
                    key={index}
                    as={Link}
                    name={domain.key}
                    to={"/" + domain.key}
                    text={<span style={{ fontSize: 12 }}>{domain.title}</span>}
                    image={{ src: hiphop, verticalAlign: "middle" }}
                    onClick={this.handleItemClick}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )
        }}
      </Query>
    )
  }
}

const mapStateToProps = ({ routing }) => ({
  url: routing.url
})

export default connect(mapStateToProps)(DomainDropdown)
