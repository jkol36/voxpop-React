import React, { Component } from "react"
import { Icon, Header, Item, Image, Divider } from "semantic-ui-react"
import defaultImage from "../../assets/image.png"
import "./QuouteWall.css"

class QuoteWall extends Component {
  renderQuotes = () => {
    const { quotes } = this.props
    if (quotes.length > 0)
      return (
        <Item.Group divided>
          {quotes
            .reverse()
            .slice(0, 5)
            .map((quote, index) => (
              <Item key={index}>
                <Image
                  src={quote.creator.profileImageUrl || defaultImage}
                  width={50}
                  height={50}
                />
                <Item.Content>
                  <Item.Description>
                    {`${quote.quote} - ${quote.content.title}`}
                  </Item.Description>
                  <Item.Extra>
                    <span
                      style={{
                        float: "right",
                        marginTop: 10,
                        marginLeft: "10px"
                      }}
                    >
                      <Icon name="heart" floated="right" />
                      <Icon name="smile" floated="right" />
                      <Icon name="plus" floated="right" />
                      <Icon name="minus" floated="right" />
                      {`By ${quote.creator.name}`}
                    </span>
                  </Item.Extra>
                </Item.Content>
              </Item>
            ))}
        </Item.Group>
      )
    return <div> No quotes available</div>
  }

  render = () => {
    return (
      <div>
        <Header
          as="h1"
          style={{ fontSize: 14, paddingTop: 20, paddingLeft: 10 }}
        >
          Quote Wall
        </Header>
        <Divider />
        {this.renderQuotes()}
        <Divider />
      </div>
    )
  }
}

export default QuoteWall
