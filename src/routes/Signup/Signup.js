import React, { PureComponent } from "react"
import { withApollo } from "react-apollo"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Container
} from "semantic-ui-react"
import { userSignup } from "../../actions/creators/signupActionCreator"

export class Signup extends PureComponent {
  state = { loading: false }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.loading) {
      this.setState({ loading: nextProps.loading })
    }
  }

  handleInputs = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = event => {
    const { username, password, name, email } = this.state

    const user = {
      name,
      username,
      password,
      email
    }

    this.props.submit(user, this.props.history)

    event.preventDefault()
  }

  handleFormSubmit = event => {
    if (event.key === "Enter") {
      this.handleSubmit(event)
    }
  }

  render = () => {
    let signupFailed =
      "error" in this.props.signup &&
      typeof this.props.signup.error !== "undefined"
    let errorMessage = signupFailed
      ? this.props.signup.error.data.error_message
      : ""
    signupFailed = signupFailed && errorMessage !== ""

    let loading = this.props.signup.loading

    return (
      <Segment as={Container} basic>
        <Grid centered>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" textAlign="center">
              Create a new Account
            </Header>
            <Form size="large" onKeyPress={this.handleFormSubmit}>
              <Segment stacked>
                <Message
                  error
                  header="Sign Up Failed"
                  content={errorMessage}
                  visible={signupFailed}
                />
                <Form.Input
                  name="name"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Name"
                  onChange={this.handleInputs}
                  error={signupFailed}
                  autoComplete="off"
                />
                <Form.Input
                  name="username"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                  onChange={this.handleInputs}
                  error={signupFailed}
                  autoComplete="off"
                />
                <Form.Input
                  name="password"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  onChange={this.handleInputs}
                  error={signupFailed}
                  autoComplete="off"
                />
                <Form.Input
                  name="email"
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="Email"
                  onChange={this.handleInputs}
                  error={signupFailed}
                  autoComplete="off"
                />
                <Button
                  color="grey"
                  fluid
                  size="large"
                  onClick={this.handleSubmit}
                  loading={loading}
                >
                  Sign Up
                </Button>
                <Divider section />
                By signing up you agree to our{" "}
                <a href="/terms">Terms of Use and Privacy Policy</a>
              </Segment>
            </Form>
            <Message>
              Already have an account? <a href="/login">Login</a>
            </Message>
          </Grid.Column>
        </Grid>
      </Segment>
    )
  }
}

const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = dispatch => ({
  submit: (user, history) => {
    dispatch(userSignup(user, history))
  }
})

export default withApollo(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup))
)
