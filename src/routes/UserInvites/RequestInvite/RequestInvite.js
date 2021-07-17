import React, { PureComponent } from "react"
import { withApollo } from "react-apollo"
import { Dimmer, Loader, Button, Message } from "semantic-ui-react"
import { USER_REQUEST_INVITE } from "../../../graphql/mutations"
import nl2br from "react-newline-to-break"
import "./RequestInvite.css"
import bgImage from "../../../assets/invite_background.png"
import { APP_TOKEN } from "../../../utils/constants"

class InviteRequest extends PureComponent {
  state = { isLoading: false, requestInvite: false, error: false, message: "" }

  handleInputs = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleGoMain = event => {
    this.setState({ isLoading: false, requestInvite: false })
    this.props.history.push("/")
  }

  handleSendInvite = async event => {
    this.setState({ isLoading: true, error: false, message: "" })
    const { email, message } = this.state
    if (email) {
      const resendFlag = message === "RESEND"
      console.log("resendFlag", resendFlag)
      try {
        const result = await this.props.client.mutate({
          mutation: USER_REQUEST_INVITE,
          variables: { email, resendFlag },
          context: { token: APP_TOKEN }
        })
        console.log("result returned from handleSendInvite", result)
        if (result && result.data.sendUserInvite.code === "SUCCESS") {
          this.setState({ requestInvite: true, error: false, message: "" })
        }
        if (result && result.data.sendUserInvite.code === "RESEND") {
          this.setState({
            requestInvite: true,
            error: false,
            message: "RESEND"
          })
        }
      } catch (e) {
        console.log("invite failed, err:", e)
        this.setState({
          error: true,
          message: e.message
        })
      }
      this.setState({ isLoading: false })
      event.persist()
    }
  }

  render() {
    console.log("Request Invite state", this.state)
    const { requestInvite, message } = this.state
    if (this.state.isLoading) {
      return (
        <div>
          <img src={bgImage} alt="Hiphop Background" className="bgImage" />
          <Dimmer active>
            <Loader size="massive" />
          </Dimmer>
        </div>
      )
    }

    if (requestInvite) {
      return (
        <div>
          <img src={bgImage} alt="Hiphop Background" className="bgImage" />
          <div className="LR-announcement-bar LR-announcement-bg-color-container">
            <h4 className="LR-announcement">
              Have an idea? Email => hello@hiphopscoreboard.com
            </h4>
          </div>

          <div className="LR-box-wrapper">
            <div className="LR-box">
              <div className="LR-box-container">
                <h1 className="LR-site-title">Hip Hop Score Board</h1>
                <div className="LR-box-inner">
                  <div className="LR-sign-up">
                    {message === "RESEND" ? (
                      <div className="LR-sign-up-container">
                        <div className="LR-site-tagline rokkitt LR-clearfix">
                          <p>Request sent.</p>
                          <div className="LR-clearfix" />
                        </div>
                        <div className="LR-site-description rokkitt">
                          <p>
                            It appears a pending invitation has been sent to
                            this address. Please check your inbox (and possibly
                            spam folder) or select resend if you like a new
                            link.
                          </p>
                        </div>
                        <div className="LR-sign-up-container-inner LR-clearfix">
                          <Button positive onClick={this.handleSendInvite}>
                            Resend
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="LR-sign-up-container">
                        <div className="LR-site-tagline rokkitt LR-clearfix">
                          <p>Request sent.</p>
                          <div className="LR-clearfix" />
                        </div>
                        <div className="LR-site-description rokkitt">
                          <p>
                            Thank you very much for your request. We will sent
                            you a confirmation email that you're accepted to use
                            our app.
                          </p>
                        </div>
                        <div className="LR-sign-up-container-inner LR-clearfix">
                          <Button positive onClick={this.handleGoMain}>
                            Go to App
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <img src={bgImage} alt="Hiphop Background" className="bgImage" />
        <div className="LR-announcement-bar LR-announcement-bg-color-container">
          <h4 className="LR-announcement">
            Have an idea? Email => hello@hiphopscoreboard.com
          </h4>
        </div>

        <div className="LR-box-wrapper">
          <div className="LR-box">
            <div className="LR-box-container">
              <h1 className="LR-site-title">Hip Hop Score Board</h1>
              <div className="LR-box-inner">
                <div className="LR-sign-up">
                  <div className="LR-site-tagline rokkitt LR-clearfix">
                    <p>Rate Lyrics.</p>
                    <div className="LR-clearfix" />
                  </div>
                  <div className="LR-site-description rokkitt">
                    <p>
                      {nl2br(
                        "\n\nWho is on your top 10 list?\nEvery rapper says they are the best, but there is no data behind their claims. \nUntil now..."
                      )}
                    </p>
                  </div>
                  <div className="LR-sign-up-container">
                    <span className="LR-sign-up-label rokkitt">
                      Request an invitation:
                    </span>
                    <Message negative hidden={!this.state.error}>
                      {nl2br(
                        "Uh-oh there was a problem sending the invitation!\n"
                      )}
                      {this.state.message}
                    </Message>
                    <div className="LR-sign-up-container-inner LR-clearfix">
                      <input
                        type="email"
                        name="email"
                        className="LR-sign-up-input"
                        placeholder="e-mail address"
                        onChange={this.handleInputs}
                      />
                      <input
                        type="submit"
                        name="submit"
                        title="GO"
                        value="GO"
                        className="LR-sign-up-submit"
                        onClick={this.handleSendInvite}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withApollo(InviteRequest)
