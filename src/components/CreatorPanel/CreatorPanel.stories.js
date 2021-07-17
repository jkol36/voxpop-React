import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import CreatorPanel from "./CreatorPanel"
import "../App/App.css"
import "semantic-ui-css/semantic.min.css"

storiesOf("CreatorPanel", module).add("default (no props passed) ", () => (
  <CreatorPanel />
))
