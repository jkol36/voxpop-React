import React, { PureComponent } from "react"
import {
  Image,
  Button,
  Segment,
  Container,
  Item,
  Table
} from "semantic-ui-react"
import FlipCard from "../../../components/Flipboard/FlipCard"
import { string, number, array } from "prop-types"
import defaultImage from "../../../assets/image.png"
class Profile extends PureComponent {
  static propTypes = {
    name: string,
    image: string,
    score: number,
    up: number,
    down: number,
    followers: array
  }

  static defaultProps = {
    name: "Artist Name",
    score: 0,
    up: 0,
    down: 0,
    followers: []
  }

  render = () => {
    const { image, score, name, up, down, followers } = this.props
    return (
      <Segment as={Container} compact padded fluid basic>
        <Item.Group>
          <Item>
            <Item.Image>
              <Image
                verticalAlign="middle"
                src={image || defaultImage}
                size="small"
              />
              <Button
                fluid
                color={this.props.isFollower ? "red" : "orange"}
                style={{ marginTop: "10px" }}
                onClick={this.props.onFollow}
              >
                {this.props.isFollower ? "UNFOLLOW" : "FOLLOW"}
              </Button>
            </Item.Image>

            <Item.Content>
              <Item.Header as="h1">{name}</Item.Header>

              <Item.Description>
                <Table basic="very">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Score</Table.Cell>
                      <Table.Cell>
                        <FlipCard
                          content={score.toString()}
                          width={22}
                          height={30}
                          fontSize={16}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Up</Table.Cell>
                      <Table.Cell>
                        <FlipCard
                          content={up.toString()}
                          width={22}
                          height={30}
                          fontSize={16}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Down</Table.Cell>
                      <Table.Cell>
                        <FlipCard
                          content={down.toString()}
                          width={22}
                          height={30}
                          fontSize={16}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Followers</Table.Cell>
                      <Table.Cell>
                        <FlipCard
                          content={followers.length.toString()}
                          width={22}
                          height={30}
                          fontSize={16}
                        />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    )
  }
}

export default Profile
