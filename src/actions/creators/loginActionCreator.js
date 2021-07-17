import axios from "axios"

import jwt from "jsonwebtoken"
import {
  USER_LOGIN_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT
} from "../types"
import { persistor } from "../../config/redux"

export const userLogin = (username, password, history) => {
  return async (dispatch, getState) => {
    const result = await getToken(username, password, dispatch)

    dispatch({
      type: USER_LOGIN_REQUEST,
      payload: { loading: true, isLoggedIn: false }
    })

    if ("error" in result) {
      const serverConnectionRefuseError = {
        data: { message: "Connection refuse" }
      }
      const errorMessage =
        typeof result.error.response !== "undefined"
          ? result.error.response
          : serverConnectionRefuseError
      dispatch({
        type: USER_LOGIN_FAILURE,
        isLoggedIn: false,
        payload: { error: errorMessage, loading: false }
      })
    } else {
      const { token, user } = result.data
      localStorage.setItem("token", token)
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: {
          user,
          isLoggedIn: true,
          loading: false,
          error: { data: { message: "" } }
        }
      })
      await persistor.flush()

      history.push("/")
    }
  }
}

const getToken = async (username, password, dispatch) => {
  try {
    return await axios.post(
      process.env.REACT_APP_SERVER + "/login",
      {
        username: username,
        password: password
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  } catch (err) {
    return { error: err }
  }
}

export function tokenValidator() {
  const storedToken = localStorage.getItem("token")

  const result = jwt.verify(storedToken, "HHSB", function(err, decoded) {
    if (err) {
      localStorage.removeItem("token")
      // console.log("Error", err);
      return false
    } else {
      // console.log(decoded);
      return true
    }
  })

  return result
}

export function clearToken() {
  localStorage.removeItem("token")
}

export const userLogout = history => {
  return async dispatch => {
    console.log("userLogout", history)
    clearToken()
    dispatch({
      type: USER_LOGOUT,
      payload: { loading: false, isLoggedIn: false }
    })

    if (history) {
      history.push("/logout")
    }
  }
}
