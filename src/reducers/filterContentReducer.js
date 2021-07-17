import * as types from "../actions/types"

const defaultState = {}

const filterContentReducer = (state = defaultState, action) => {
  let _state
  switch (action.type) {
    case types.SEARCH_CONTENT:
      _state = { ...state, ...action.payload }
      return _state
    default:
      return state
  }
}

export default filterContentReducer
