import * as types from "../actions/types"

const defaultState = {
  isLoggedIn: false
}

const loginReducer = (state = defaultState, action) => {
  let _state
  switch (action.type) {
    case types.USER_LOGIN_REQUEST:
      _state = { ...state, ...action.payload }
      return _state
    case types.USER_LOGIN_SUCCESS:
      _state = { ...state, ...action.payload }
      return _state
    case types.USER_LOGIN_FAILURE:
      _state = { ...state, ...action.payload }
      return _state
    case types.USER_LOGOUT:
      _state = { ...state, ...action.payload }
      return _state
    default:
      return state
  }
}

export default loginReducer
