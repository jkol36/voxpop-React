import * as types from "../actions/types"

const defaultState = {}

const artistReducer = (state = defaultState, action) => {
  let _state
  switch (action.type) {
    case types.UPDATE_CURRENT_SONG:
      _state = { ...state, ...action.payload }
      return _state
    default:
      return state
  }
}

export default artistReducer
