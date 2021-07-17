import React, { Component } from "react"
import { Card } from "semantic-ui-react"
import { withRouter } from "react-router-dom"

class Subscoreboard extends Component {
  render = () => {
    const items = this.props.contents.map(content => ({
      header: content.title,
      meta: content.created,
      description: content.text.substring(0, 30) + "...",
      fluid: true,
      onClick: () => {
        const { history, location } = this.props
        const pathname =
          location.pathname[location.pathname.length - 1] === "/"
            ? `content/${content._id}`
            : `/content/${content._id}`
        window.location.reload()
        history.push(location.pathname + pathname)
      }
    }))
    return <Card.Group items={items} />
  }
}

export default withRouter(Subscoreboard)
