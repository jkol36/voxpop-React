import React, { Component } from "react"
import {
  Container,
  Segment,
  Form,
  Header,
  Divider,
  Modal,
  Button,
  Input,
  Popup
} from "semantic-ui-react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { ToastContainer, toast } from "react-toastify"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import { Article } from "newspaperjs"

const SUBMIT_TEXT = gql`
  mutation submitContent($content: ContentInput!) {
    addContent(content: $content) {
      _id
    }
  }
`

const CREATE_DOMAIN = gql`
  mutation submitDomain($domain: DomainInput!) {
    createDomain(domain: $domain) {
      _id
    }
  }
`

const DOMAIN_QUERY = gql`
  query domains($limit: Int!) {
    domains(limit: $limit) {
      _id
      adminIds
      allowedUserIds
      key
      privacy
      title
      url
      description
    }
  }
`

class SubmissionForm extends Component {
  state = {
    title: "",
    text: "",
    domain: {},
    showShareableLink: false,
    createSubScoreboard: false,
    domainTitle: "",
    privacy: "private"
  }

  handleSubmit = (event, submitText) => {
    event.preventDefault()
    if (this.state.createSubScoreboard) {
      submitText({
        variables: {
          domain: {
            userId: this.props.userId,
            title: this.state.domainTitle,
            url: "/" + this.state.domainTitle.toLowerCase(),
            key: this.state.domainTitle.toLowerCase(),
            privacy: this.state.privacy,
            description: "Descripton for " + this.state.domainTitle + " domain"
          }
        }
      })
    } else {
      submitText({
        variables: {
          content: {
            title: this.state.title,
            text: this.state.text,
            creatorId: this.props.authorId,
            domainId: this.state.domain.id
          }
        }
      })
    }
  }

  handleInputChange = (event, { name, value }) => {
    const proxyurl = "https://cors-anywhere.herokuapp.com/"
    Article(proxyurl + value)
      .then(result => {
        this.setState({ [name]: result.text, title: result.title })
      })
      .catch(reason => {
        console.log("ERROR:", reason)
      })
    this.setState({ [name]: value })
  }

  handleSuccess = event => {
    if (this.state.createSubScoreboard) {
      toast.success("New domain created successfully!")
      this.setState({ createSubScoreboard: false })
    } else {
      toast.success("Submitted successfully!")
      this.setState({ title: "", text: "", showShareableLink: true })
    }
  }

  handleError = event => {
    toast.error(
      "Content submission failed: Please provide input for required fields."
    )
  }

  handleClose = () => {
    this.setState({ showShareableLink: false })
  }

  handleCopy = shareableLink => {
    const textArea = document.createElement("textarea")
    textArea.value = shareableLink
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
    toast.info("Copied to clipboard!")
  }

  handleDropdownChange = (e, { options, value }) => {
    this.setState({ domain: options.find(item => item.value === value) })
  }

  handlePrivacyChange = (e, data) => {
    console.log("handlePrivacyChange", data.value)
    this.setState({ privacy: data.value })
  }

  handleCreateSubScoreboard = () => {
    this.setState({ createSubScoreboard: true })
  }

  handleNewSubBoardInputChange = (e, { value }) => {
    e.preventDefault()
    this.setState({ domainTitle: value })
  }
  handleCancelNewSubScoreboard = () => {
    this.setState({ createSubScoreboard: false })
  }
  renderCreateNewScoreboard = () => {
    return (
      <React.Fragment>
        <Form.Input
          label="New Subscoreboard"
          placeholder="Add new subscoreboard"
          onChange={this.handleNewSubBoardInputChange}
          required
        />
        <Form.Dropdown
          label="Privacy"
          selection
          options={[
            { key: "private", text: "private", value: "private" },
            { key: "public", text: "public", value: "public" }
          ]}
          placeholder="Choose privacy"
          onChange={this.handlePrivacyChange}
        />
        <Popup
          trigger={
            <Button
              as="a"
              color="red"
              icon="cancel"
              style={{ height: "40px", marginTop: "auto" }}
              onClick={this.handleCancelNewSubScoreboard}
            />
          }
          content="Cancel new scoreboard"
        />
        <Popup
          trigger={
            <Button
              color="teal"
              icon="check"
              style={{ height: "40px", marginTop: "auto" }}
            />
          }
          content="Save new scoreboard"
        />
      </React.Fragment>
    )
  }

  renderModal = id => {
    const shareableLink = `/boards/${this.state.domain.key}/content/${id}`
    return (
      <Modal
        size="tiny"
        open={this.state.showShareableLink}
        onClose={this.handleClose}
      >
        <Modal.Header>Your shareable link is ready</Modal.Header>
        <Modal.Content>
          <Segment basic padded>
            Share your text to your friends and family.
            <Input
              fluid
              action={{
                color: "teal",
                icon: "copy",
                content: "Copy",
                labelPosition: "left",
                onClick: e => this.handleCopy(shareableLink)
              }}
              value={shareableLink}
            />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button
            as={Link}
            positive
            content="Go to text"
            to={`/boards/${this.state.domain.key}/content/${id}`}
          />
          <Button negative onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  render = () => {
    const { createSubScoreboard } = this.state
    return (
      <Mutation
        mutation={createSubScoreboard ? CREATE_DOMAIN : SUBMIT_TEXT}
        onCompleted={this.handleSuccess}
        onError={this.handleError}
      >
        {(submitText, { data }) => {
          let id = ""
          if (data && data.addContent) id = data.addContent._id
          return (
            <Container>
              <Segment basic padded="very">
                <Header as="h2">User Submission Form</Header>
                <Divider />
                <Form
                  onSubmit={event => {
                    this.handleSubmit(event, submitText)
                  }}
                >
                  <Form.Group widths="equal">
                    <Form.Input
                      name="title"
                      label="Title"
                      value={this.state.title}
                      autoComplete="off"
                      onChange={this.handleInputChange}
                      required
                    />
                    {createSubScoreboard ? (
                      this.renderCreateNewScoreboard()
                    ) : (
                      <React.Fragment>
                        <Query
                          query={DOMAIN_QUERY}
                          variables={{ limit: 0 }}
                          pollInterval={500}
                        >
                          {({ loading, error, data }) => {
                            let options = []

                            if (data.domains) {
                              options = data.domains
                                .filter(domain => {
                                  const isUserAllowed = domain.allowedUserIds.find(
                                    id => id === this.props.userId
                                  )
                                  return (
                                    domain.privacy === "public" ||
                                    (domain.privacy === "private" &&
                                      isUserAllowed)
                                  )
                                })
                                .map(domain => ({
                                  key: domain.key,
                                  text: domain.title,
                                  value: domain.key,
                                  id: domain._id
                                }))
                            }

                            return (
                              <Form.Dropdown
                                placeholder="Select a subscoreboard"
                                selection
                                name="subscoreboard"
                                label="Subscoreboard"
                                options={options}
                                onChange={this.handleDropdownChange}
                                required
                              />
                            )
                          }}
                        </Query>
                        <Popup
                          trigger={
                            <Button
                              as="a"
                              color="teal"
                              icon="add"
                              style={{ height: "40px", marginTop: "auto" }}
                              onClick={this.handleCreateSubScoreboard}
                            />
                          }
                          content="Add new subscoreboard"
                        />
                      </React.Fragment>
                    )}
                  </Form.Group>
                  <Form.TextArea
                    name="text"
                    rows={10}
                    label="Text"
                    placeholder="Write your article text here or paste a URL"
                    value={this.state.text}
                    onChange={this.handleInputChange}
                    required
                  />
                  <Form.Button color="teal">Submit</Form.Button>
                </Form>
                <ToastContainer
                  position="bottom-left"
                  autoClose={5000}
                  closeOnClick
                />
                {this.renderModal(id)}
              </Segment>
            </Container>
          )
        }}
      </Mutation>
    )
  }
}

const mapStateToProps = ({ login: { user } }) => ({
  authorId: user.creatorId,
  userId: user._id
})

export default connect(mapStateToProps)(SubmissionForm)
