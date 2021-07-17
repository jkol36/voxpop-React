import React, { PureComponent } from "react"
import {
  Button,
  Container,
  Image,
  Item,
  Segment,
  Table
} from "semantic-ui-react"
import FlipCard from "../../components/Flipboard/FlipCard"
import { number, shape, string } from "prop-types"

class UserProfile extends PureComponent {
  static propTypes = {
    user: shape({
      user_id: string,
      name: string,
      points: number,
      vote_cast: number,
      image: string,
      followers: number,
      following: number
    })
  }

  static defaultProps = {
    user: {
      user_id: "",
      name: "John Doe",
      points: 59,
      vote_cast: 24,
      image:
        "https://www.digitalwallonia.be/wp-content/plugins/evenement/src/front/assets/img//contact-default.png",
      followers: 3853,
      following: 13254
    }
  }

  render = () => {
    const { user, onFollow } = this.props
    const visibility = user.showFollowButton ? "visible" : "hidden"
    return (
      <Segment as={Container} compact padded fluid>
        <Item.Group>
          <Item>
            <Item.Image>
              <Image src={user.image} width={300} height={300} />

              <Button
                fluid
                color={user.isFollower ? "red" : "orange"}
                style={{ marginTop: "10px", visibility }}
                onClick={onFollow}
              >
                {user.isFollower ? "UNFOLLOW" : "FOLLOW"}
              </Button>
            </Item.Image>

            <Item.Content>
              <Item.Header as="h1">{user.name}</Item.Header>

              <Item.Description>
                <Table basic="very">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Points</Table.Cell>
                      <Table.Cell>
                        <FlipCard
                          content={user.points.toString()}
                          width={22}
                          height={30}
                          fontSize={16}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Vote Cast</Table.Cell>
                      <Table.Cell>
                        <FlipCard
                          content={user.vote_cast.toString()}
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
                          content={user.followers.toString()}
                          width={22}
                          height={30}
                          fontSize={16}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Following</Table.Cell>
                      <Table.Cell>
                        <FlipCard
                          content={user.following.toString()}
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

export default UserProfile
