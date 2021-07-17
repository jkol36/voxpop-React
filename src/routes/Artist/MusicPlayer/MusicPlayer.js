import React, { PureComponent } from "react"
import { Segment, Grid, Label, Dimmer, Loader } from "semantic-ui-react"
import SpotifyPlayer from "react-spotify-player"

import FlipCard from "../../../components/Flipboard/FlipCard"
import Section from "../../../components/Layouts/Section/Section"
import PropTypes from "prop-types"

class MusicPlayer extends PureComponent {
  static propTypes = {
    score: PropTypes.number.isRequired,
    upvotes: PropTypes.number.isRequired,
    downvotes: PropTypes.number.isRequired,
    spotifyUri: PropTypes.string
  }

  static defaultProps = {
    score: 0,
    upvotes: 0,
    downvotes: 0
  }

  render = () => {
    return (
      <Section title="Music Player">
        <Grid>
          <Grid.Row textAlign="left">
            <Grid.Column verticalAlign="middle" width={16}>
              {!this.props.spotifyUri ? (
                <Segment basic>
                  <Dimmer active>
                    <Loader size="small" />
                  </Dimmer>
                </Segment>
              ) : (
                <SpotifyPlayer
                  uri={this.props.spotifyUri}
                  size={{ width: "100%", height: 80 }}
                  view="list"
                  theme="white"
                />
              )}
              <Label.Group color="black">
                <Label basic>
                  Score
                  <Label.Detail>
                    <FlipCard
                      content={this.props.score.toString()}
                      width={22}
                      height={30}
                      fontSize={16}
                    />
                  </Label.Detail>
                </Label>
                <Label basic>
                  Upvotes<Label.Detail>
                    <FlipCard
                      content={this.props.upvotes.toString()}
                      width={22}
                      height={30}
                      fontSize={16}
                    />
                  </Label.Detail>
                </Label>
                <Label basic>
                  Downvotes<Label.Detail>
                    <FlipCard
                      content={this.props.downvotes.toString()}
                      width={22}
                      height={30}
                      fontSize={16}
                    />
                  </Label.Detail>
                </Label>
              </Label.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Section>
    )
  }
}

export default MusicPlayer
