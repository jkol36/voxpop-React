const UPDATE_AUTHOR_INFO = "UPDATE_AUTHOR_INFO"

const defaultState = {}

const authorReducer = (state = defaultState, action) => {
  let _state
  switch (action.type) {
    case UPDATE_AUTHOR_INFO:
      _state = { ...state, ...action.payload }
      return _state
    default:
      return state
  }
}

export default authorReducer
