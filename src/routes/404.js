import React, { PureComponent } from "react"
import { Image, Container } from "semantic-ui-react"
import route404 from "../assets/404.jpg"

class Route404 extends PureComponent {
  render = () => {
    return (
      <div>
        <Container>
          <Image src={route404} />
        </Container>
      </div>
    )
  }
}

export default Route404
