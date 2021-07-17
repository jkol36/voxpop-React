import React from "react"
import { storiesOf } from "@storybook/react"

import "../App/App.css"
import "semantic-ui-css/semantic.min.css"
import ProfileHeader from "./ProfileHeader"
import UserPlaceHolder from "./UserPlaceHolder/UserPlaceHolder"
import VoteHistory from "../VoteHistory/VoteHistory"
import Followers from "../Followers/Followers"

storiesOf("Profile", module)
  .add("Header", () => <ProfileHeader />)
  .add("Place Holder", () => <UserPlaceHolder />)
  .add("Vote History", () => <VoteHistory loading={true} />)
  .add("Following", () => <Followers />)
