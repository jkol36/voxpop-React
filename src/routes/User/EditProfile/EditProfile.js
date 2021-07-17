import React, { PureComponent } from "react"
import { compose, graphql, withApollo } from "react-apollo"
import { connect } from "react-redux"
import { GET_USER_INFO } from "../../../graphql/queries"
import { UPDATE_USER } from "../../../graphql/mutations"
import { Button, Grid, Image, Input, Item } from "semantic-ui-react"
import ImageUploader from "./ImageUploader/ImageUploader"
import hipHopLogo from "../../../assets/hiphop.png"

class EditProfile extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      imageUploadedSrc:
        "https://www.digitalwallonia.be/wp-content/plugins/evenement/src/front/assets/img//contact-default.png",
      loading: false,
      values: {},
      formChanged: false,
      defaultValues: {
        imageUploadedSrc:
          "https://www.digitalwallonia.be/wp-content/plugins/evenement/src/front/assets/img//contact-default.png",
        name: "",
        email: "",
        username: "",
        password: "password",
        confirmPassword: "password"
      }
    }

    this.handleImageChange = this.handleImageChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("nextprops", nextProps)
    this.setState({
      imageUploadedSrc: nextProps.user.avatar,
      defaultValues: {
        imageUploadedSrc: nextProps.user.avatar,
        name: nextProps.user.name,
        email: nextProps.user.email,
        username: nextProps.user.username,
        password: "password",
        confirmPassword: "password"
      }
    })
  }

  handleImageChange(image, imageBase64) {
    const imageValues = {
      imageUploadedSrc: imageBase64,
      error: "",
      formChanged: true
    }

    this.setState(imageValues)
  }

  handleSave = async event => {
    const { defaultValues } = this.state
    if (defaultValues) {
      let userInput = {
        _id: this.props.loginUserId,
        name:
          "name" in defaultValues ? defaultValues.name : this.props.user.name,
        avatar:
          "imageUploadedSrc" in this.state
            ? this.state.imageUploadedSrc
            : this.props.user.avatar
      }

      if ("confirmPassword" in defaultValues) {
        if (defaultValues.confirmPassword !== "password") {
          userInput.password = defaultValues.confirmPassword
        }
      }

      this.setState({ formChanged: false })

      return await this.props.client.mutate({
        mutation: UPDATE_USER,
        variables: {
          user: userInput
        },
        refetchQueries: [
          {
            query: GET_USER_INFO,
            variables: { user_id: this.props && this.props.match.params.userId }
          }
        ]
      })
    }
  }

  handleCancel(event) {
    this.setState({
      imageUploadedSrc: this.props.user.avatar,
      formChanged: false,
      defaultValues: {
        imageUploadedSrc: this.props.user.avatar,
        name: this.props.user.name,
        email: this.props.user.email,
        username: this.props.user.username,
        password: "password",
        confirmPassword: "password"
      }
    })
  }

  handleChange = event => {
    this.setState({
      defaultValues: { [event.target.name]: event.target.value },
      formChanged: true
    })
  }

  render() {
    const { formChanged, imageUploadedSrc, defaultValues } = this.state
    return (
      <Grid divided="vertically">
        <Grid.Row columns={2}>
          <Grid.Column width={12}>
            <Item.Group>
              <Item>
                <Item.Image>
                  <ImageUploader
                    src={
                      imageUploadedSrc
                        ? imageUploadedSrc
                        : defaultValues.imageUploadedSrc
                    }
                    onUpload={this.handleImageChange}
                  />
                </Item.Image>
                <Item.Content>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={this.state.defaultValues.name}
                    placeholder="Name"
                    icon="user"
                    iconPosition="left"
                    size="large"
                    onChange={e => {
                      this.handleChange(e)
                    }}
                    fluid
                  />
                  <br />
                  <br />
                  <Input
                    value={this.state.defaultValues.email}
                    placeholder="Email"
                    icon="mail"
                    iconPosition="left"
                    size="large"
                    disabled
                    fluid
                  />
                  <br />
                  <br />
                  <Input
                    value={this.state.defaultValues.username}
                    placeholder="Username"
                    icon="lock"
                    iconPosition="left"
                    size="large"
                    disabled
                    fluid
                  />
                  <br />
                  <br />
                  <Input
                    id="password"
                    name="password"
                    value={this.state.defaultValues.password}
                    type="password"
                    placeholder="Password"
                    icon="lock"
                    onChange={e => {
                      this.handleChange(e)
                    }}
                    iconPosition="left"
                    size="large"
                    fluid
                  />
                  <br />
                  <br />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={this.state.defaultValues.confirmPassword}
                    type="password"
                    onChange={e => {
                      this.handleChange(e)
                    }}
                    placeholder="Confirm Password"
                    icon="lock"
                    iconPosition="left"
                    size="large"
                    fluid
                  />
                  <br />
                  <br />
                  <Button
                    disabled={!formChanged}
                    label="Save"
                    onClick={this.handleSave}
                    primary={true}
                    style={{ marginRight: "10px", minWidth: "100px" }}
                  />
                  <Button
                    onClick={this.handleCancel}
                    style={{ marginRight: "10px", minWidth: "100px" }}
                    primary={false}
                    label="Cancel"
                  />
                </Item.Content>
              </Item>
            </Item.Group>
          </Grid.Column>
          <Grid.Column width={4} verticalAlign="bottom">
            <Image style={{ opacity: 0.1 }} src={hipHopLogo} fluid />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = ({ login }) => {
  if (login && login.user) {
    return {
      loginUserId: login.user._id
    }
  }
}

export default withApollo(
  compose(
    connect(mapStateToProps),
    graphql(GET_USER_INFO, {
      options: ownProps => {
        const userId = ownProps && ownProps.loginUserId
        return {
          variables: {
            user_id: userId
          }
        }
      },
      props: ({ data: { user } }) => ({
        user: user
      })
    })
  )(EditProfile)
)
