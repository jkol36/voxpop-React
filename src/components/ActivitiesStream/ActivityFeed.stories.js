import React from "react"
import { storiesOf } from "@storybook/react"

import "../App/App.css"
import "semantic-ui-css/semantic.min.css"
import ActivityFeed from "./ActivityFeed"

storiesOf("Activity Feed", module).add("ActivityFeed", () => <ActivityFeed />)
