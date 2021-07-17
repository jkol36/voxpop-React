import React from "react"
import { Redirect, Route } from "react-router-dom"
import {
  tokenValidator,
  userLogout
} from "../actions/creators/loginActionCreator"
import { connect } from "react-redux"

const verifyToken = () => {
  return tokenValidator()
}

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const validToken = verifyToken()
  console.log({ validToken })
  if (!validToken) this.props.logout(null)
  return (
    <Route
      {...rest}
      render={props =>
        validToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  )
}

const mapDispatchToProps = dispatch => ({
  logout: history => {
    dispatch(userLogout(history))
  }
})
export default connect(
  null,
  mapDispatchToProps
)(PrivateRoute)
