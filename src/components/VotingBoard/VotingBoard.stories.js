import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import VotingBoard from "./VotingBoard"
import ActionPopup from "./ActionPopup"
import "../App/App.css"
import "semantic-ui-css/semantic.min.css"

const content =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed nisl iaculis, molestie elit nec, placerat sapien. Integer et felis luctus, dapibus arcu in, viverra massa. Aenean mattis non nisl a efficitur. Donec sed augue leo. Integer lacinia dui at purus luctus vehicula. Donec sed porttitor tellus. Proin vitae semper nisi, mattis sodales mi. Donec faucibus, mauris commodo volutpat egestas, nibh justo porttitor lacus, ac blandit sapien libero id tortor. Proin ac est a elit condimentum facilisis. Sed turpis quam, malesuada vel enim sollicitudin, euismod hendrerit orci. Ut nibh augue, convallis sed nisl non, finibus porta tellus. Nullam mi sapien, condimentum at odio sit amet, pulvinar dapibus diam."

const WrappedVotingBoard = props => (
  <div style={{ margin: 50 }}>
    <VotingBoard {...props}>
      {({ text }) => (
        <ActionPopup
          text={text}
          onVote={action("voted")}
          onAddComment={action("commented")}
          onShareQuote={action("share")}
        />
      )}
    </VotingBoard>
  </div>
)

storiesOf("VotingBoard", module)
  .add("default (no props passed) ", () => <WrappedVotingBoard />)
  .add("with content", () => <WrappedVotingBoard content={content} />)
  .add("with onChange handler", () => (
    <WrappedVotingBoard content={content} onSelect={action("highlighting")} />
  ))
