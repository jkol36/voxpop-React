import * as actions from "../actions/routing.actions"

const defaultState = {
  domain: "",
  url: "",
  domains: []
}

const routing = (state = defaultState, action) => {
  let _state
  switch (action.type) {
    case actions.SET_DOMAIN:
      _state = { ...state, domain: action.payload }
      return _state

    case actions.SET_DOMAIN_LIST:
      _state = { ...state, domains: [...action.payload] }
      return _state

    case actions.SET_DOMAIN_URL:
      _state = { ...state, url: action.payload }
      return _state

    case actions.UPDATE_DOMAIN:
      _state = { ...state, ...action.payload }
      return _state

    default:
      return state
  }
}

export default routing
