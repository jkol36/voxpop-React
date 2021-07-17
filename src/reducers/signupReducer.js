import * as types from "../actions/types"

const defaultState = {}

const signupReducer = (state = defaultState, action) => {
  let _state
  switch (action.type) {
    case types.USER_SIGNUP_SUCCESS:
      _state = { ...state, ...action.payload }
      return _state
    case types.USER_SIGNUP_FAILURE:
      _state = { ...state, ...action.payload }
      return _state
    case types.USER_SIGNUP_REQUEST:
      _state = { ...state, ...action.payload }
      return _state
    default:
      return state
  }
}

export default signupReducer
