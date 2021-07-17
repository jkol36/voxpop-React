import React, { Component } from "react"
import { List, Segment } from "semantic-ui-react"

import Section from "../../components/Layouts/Section/Section"
import PropTypes from "prop-types"

class SubmittedText extends Component {
  static propTypes = {
    submissions: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string
      })
    )
  }

  render = () => {
    const { submissions } = this.props
    return (
      <Section title="Submitted Text">
        <List ordered relaxed>
          {submissions ? (
            submissions.map(submission => (
              <List.Item key={submission.title}>
                <List.Content>
                  <List.Header>{submission.title}</List.Header>
                </List.Content>
              </List.Item>
            ))
          ) : (
            <Segment basic>No submissions yet!</Segment>
          )}
        </List>
      </Section>
    )
  }
}

export default SubmittedText
