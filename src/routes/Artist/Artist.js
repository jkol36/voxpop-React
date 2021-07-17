import React, { PureComponent } from "react"
import { Grid, Container, Segment, Loader, Dimmer } from "semantic-ui-react"
import Profile from "./Profile/profileContainer"
import TopArtists from "../../components/TopArtists/topArtistsContainer"
import ErrorBoundary from "../../components/ErrorBoundary"
import Albums from "./Albums"
import MusicPlayer from "./MusicPlayer/musicPlayerContainer"
import Lyrics from "./Lyrics/Lyrics.container"
import Comments from "./Comments"
import { string, number, arrayOf, shape } from "prop-types"

const getRanges = list => {
  return list.map(item => ({
    startIndex: item.startIndex,
    endIndex: item.endIndex,
    id: item._id
  }))
}

class Artist extends PureComponent {
  static propTypes = {
    albums: arrayOf(
      shape({
        name: string,
        id: number,
        songs: arrayOf(
          shape({
            title: string,
            songId: number,
            albumId: number
          })
        )
      })
    ),
    artistId: number,
    songId: number
  }

  static defaultProps = {
    albums: []
  }

  render = () => {
    if (this.props.loading || !this.props.songId || !this.props.artistId) {
      return (
        <Segment basic style={{ top: "40vh" }}>
          <Dimmer active inverted>
            <Loader size="massive" />
          </Dimmer>
        </Segment>
      )
    } else {
      return (
        <ErrorBoundary>
          <Segment as={Container} basic>
            <Grid doubling stackable>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Profile artistId={this.props.artistId} />
                </Grid.Column>
                <Grid.Column>
                  <TopArtists />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={5}>
                  <Albums
                    albums={this.props.albums}
                    loading={this.props.albums.length <= 0}
                  />
                  <Comments comments={this.props.comments} />
                </Grid.Column>
                <Grid.Column width={11}>
                  <MusicPlayer
                    songId={this.props.songId}
                    artistId={this.props.artistId}
                  />
                  <br />
                  <Lyrics
                    songId={this.props.songId}
                    artistId={this.props.artistId}
                    highlights={getRanges(this.props.comments)}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </ErrorBoundary>
      )
    }
  }
}

export default Artist
