import React, { PureComponent } from "react"
import { Button, Grid, Modal } from "semantic-ui-react"
import { showVoteNumberSign } from "../../utils/common"

class ContentModal extends PureComponent {
  state = {
    open: false
  }

  render() {
    const { open } = this.state
    const { content } = this.props
    const upVotes = showVoteNumberSign(content.scoreDetails.upvotes, true)
    const downVotes = showVoteNumberSign(content.scoreDetails.downvotes, false)
    return (
      <Modal
        open={open}
        trigger={
          <Button as="a" onClick={() => this.setState({ open: !open })}>
            {content.title}
          </Button>
        }
      >
        <Modal.Header>
          <Grid>
            <Grid.Row>
              <Grid.Column width={13}>{content.title}</Grid.Column>
              <Grid.Column>
                <Button color="green"> {upVotes}</Button>
              </Grid.Column>
              <Grid.Column>
                <Button color="red" style={{ marginLeft: 10 }}>
                  {" "}
                  {downVotes}
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid.Row>
            <small style={{ fontSize: "0.5em" }}>
              By {content.creator ? content.creator.name : "Unknown Author"}
            </small>
          </Grid.Row>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>{content.text}</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={() => this.setState({ open: !open })}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default ContentModal
