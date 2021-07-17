import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App/App"
import { BrowserRouter as Router } from "react-router-dom"

import { ApolloProvider } from "react-apollo"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import store, { persistor } from "./config/redux"
import client from "./config/apollo"
import "react-dates/initialize"
import "react-dates/lib/css/_datepicker.css"

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
)
