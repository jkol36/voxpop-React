import React, { PureComponent } from "react"
import { connect } from "react-redux"
import {
  Accordion,
  Icon,
  Menu,
  Segment,
  Dimmer,
  Loader
} from "semantic-ui-react"
import { bool, arrayOf, shape, string, number } from "prop-types"

class Albums extends PureComponent {
  state = { activeIndex: -1 }

  static propTypes = {
    loading: bool,
    albums: arrayOf(
      shape({
        name: string,
        id: number,
        songs: arrayOf(
          shape({
            title: string,
            albumId: number,
            songId: number
          })
        )
      })
    )
  }

  static defaultProps = {
    loading: true,
    albums: [{ name: "Not Available", songs: [{ title: "Not Available" }] }]
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  handleSongClick = (event, data) => {
    const { songId } = this.state
    const newSongId = songId === data.id ? -1 : data.id
    this.setState({ songId: newSongId })
    this.props.changeSong({ id: data.id, title: data.title })
  }

  renderLoader = () => (
    <Segment style={{ minHeight: "100px" }}>
      <Dimmer active>
        <Loader size="small">Loading Albums</Loader>
      </Dimmer>
    </Segment>
  )

  renderComponent = () => {
    const { activeIndex, songId } = this.state

    const { albums } = this.props
    return (
      <Accordion as={Menu} vertical fluid basic>
        {albums.map(album => (
          <Menu.Item key={album.album_id}>
            <Accordion.Title
              key={album.album_id}
              active={activeIndex === album.album_id}
              index={album.album_id}
              onClick={this.handleClick}
            >
              <Icon name="dropdown" />
              <strong>{album.title}</strong>
            </Accordion.Title>
            <Accordion.Content
              active={activeIndex === album.album_id}
              content={album.songs.map(song => (
                <Menu.Menu key={song.song_id}>
                  <Menu.Item
                    id={song.song_id}
                    active={songId === song.song_id}
                    title={song.title}
                    onClick={this.handleSongClick}
                  >
                    {song.title}
                  </Menu.Item>
                </Menu.Menu>
              ))}
            />
          </Menu.Item>
        ))}
      </Accordion>
    )
  }

  render = () => {
    return (
      <div>
        {this.props.loading ? this.renderLoader() : this.renderComponent()}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  changeSong: song => {
    dispatch({
      type: "UPDATE_CURRENT_SONG",
      payload: { currentSongId: song.id, currentSongTitle: song.title }
    })
  }
})

export default connect(null, mapDispatchToProps)(Albums)
