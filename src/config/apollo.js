import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import { ApolloLink, concat } from "apollo-link"
import { WebSocketLink } from "apollo-link-ws"
import { split } from "apollo-link"
import { getMainDefinition } from "apollo-utilities"

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER + "/graphql"
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_SERVER_WS + "/graphql",
  options: {
    lazy: true,
    reconnect: true,
    timeout: 30000,
    connectionParams: () => ({
      authToken: localStorage.getItem("token")
    })
  }
})

const subscriptionMiddleware = {
  applyMiddleware: (options, next) => {
    options.authToken = localStorage.getItem("token")
    options.context = {
      token: localStorage.getItem("token")
    }
    next()
  }
}
// add the middleware to the web socket link via the Subscription Transport client
wsLink.subscriptionClient.use([subscriptionMiddleware])

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === "OperationDefinition" && operation === "subscription"
  },
  wsLink,
  httpLink
)

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const { token } = operation.getContext()
  operation.setContext({
    headers: {
      authorization: token || localStorage.getItem("token"),
      domain: "hiphop"
    }
  })

  return forward(operation)
})

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  link: concat(authMiddleware, link),
  cache: new InMemoryCache()
})

export default client
