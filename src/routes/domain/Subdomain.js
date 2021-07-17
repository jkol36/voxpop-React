import React, { Component } from "react"
import { Route, Switch } from "react-router-dom"
import { connect } from "react-redux"

import { BasicLayout } from "../../components/Layouts"
import { GlobalHeader } from "../../components/Header"
import {
  Home,
  CreateNewScoreboard,
  Scoreboard,
  Login,
  Signup,
  Terms,
  RequestInvite,
  Shareables,
  SubmitContent,
  User,
  AppSettings,
  Content
} from "../"
import PrivateRoute from "../../components/PrivateRoute"

import * as actions from "../../actions/routing.actions"
import { domains } from "../../common/domains"
import PropTypes from "prop-types"

class Subdomain extends Component {
  static propTypes = {
    url: PropTypes.string,
    updateDomain: PropTypes.func
  }

  componentDidMount = () => {
    const { domain } = this.props.match.params
    this.props.updateDomain({ domain, url: "/" + domain })
    const isValidDomain = domains.find(route => route.key === domain)
    if (!isValidDomain) this.props.history.push("/error/404")
  }

  render = () => {
    const { url } = this.props
    return (
      <BasicLayout>
        <GlobalHeader />
        <Switch>
          <Route exact path={url} component={Home} />
          <Route path={url + "/home"} component={Home} />
          <Route path={url + "/top-content"} component={Scoreboard} />
          <Route path={url + "/trending-content"} component={Scoreboard} />
          <Route
            path={url + "/create-scoreboard"}
            component={CreateNewScoreboard}
          />
          <Route path={url + "/login"} component={Login} />
          <Route path={url + "/logout"} component={Login} />
          <Route path={url + "/signup"} component={Signup} />
          <Route path={url + "/terms"} component={Terms} />
          <Route path={url + "/invite"} component={RequestInvite} />
          <Route path={url + "/shareables/:code"} component={Shareables} />
          <PrivateRoute
            path={url + "/submit-content"}
            component={SubmitContent}
          />
          <PrivateRoute
            path={url + "/content/:contentId"}
            component={Content}
          />
          <PrivateRoute path={url + "/user/:userId"} component={User} />
          <PrivateRoute path={url + "/settings"} component={AppSettings} />
          <Route path={url + "/:username"} component={User} />
        </Switch>
      </BasicLayout>
    )
  }
}

const mapStateToProps = ({ routing }) => ({
  url: routing.url
})

const mapDispatchToProps = dispatch => ({
  updateDomain: domain => {
    dispatch({ type: actions.UPDATE_DOMAIN, payload: domain })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Subdomain)
