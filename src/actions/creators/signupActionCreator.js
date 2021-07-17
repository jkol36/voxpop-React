import axios from "axios"

import {
  USER_SIGNUP_FAILURE,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS
} from "../types"

export const userSignup = (user, history) => {
  return async (dispatch, getState) => {
    const result = await registerUser(user)

    dispatch({ type: USER_SIGNUP_REQUEST, payload: { loading: true } })

    if ("error" in result) {
      const serverConnectionRefuseError = {
        data: { message: "Connection refuse" }
      }
      const errorMessage =
        typeof result.error.response !== "undefined"
          ? result.error.response
          : serverConnectionRefuseError
      dispatch({
        type: USER_SIGNUP_FAILURE,
        payload: { error: errorMessage, loading: false }
      })
    } else {
      const { user } = result.data
      dispatch({
        type: USER_SIGNUP_SUCCESS,
        payload: {
          user,
          loading: false,
          error: { data: { message: "" } }
        }
      })

      history.push("/login")
    }
  }
}

const registerUser = async user => {
  try {
    const response = await axios.post(
      process.env.REACT_APP_SERVER + "/register",
      user,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
          "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS"
        }
      }
    )
    return response
  } catch (err) {
    return { error: err }
  }
}
