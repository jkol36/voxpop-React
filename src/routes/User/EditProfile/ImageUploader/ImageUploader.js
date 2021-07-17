import React, { PureComponent } from "react"
import { Cropper } from "react-image-cropper"
import { evaluate } from "../../../../utils/evaluator"
import { Modal, Image, Button } from "semantic-ui-react"
import PropTypes from "prop-types"

class ImageUploader extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      openDialog: false,
      imageBase64: "",
      image: "",
      error: ""
    }

    this.handleClickUploadImage = this.handleClickUploadImage.bind(this)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleClose = () => {
    this.setState({ openDialog: false })
  }

  handleOpen = () => {
    this.setState({ openDialog: true })
  }

  handleSubmit = event => {
    const croppedImage = this.refs.image.crop()

    this.props.onUpload(this.state.image, croppedImage)
    this.setState({ openDialog: false })
  }

  handleClickUploadImage(event) {
    const imageUploader = this.refs.upload
    imageUploader.click()
  }

  handleImageUpload(event) {
    let reader = new FileReader()
    const image = event.target.files[0]
    const imageUploader = this.refs.upload

    const { maxSize, imgExtensions } = this.props

    let errorMap = []

    if (maxSize) {
      errorMap.push({
        expr: image.size < maxSize,
        payload: "Image size exceeds 500kb!"
      })
    }

    if (imgExtensions) {
      let typePass = false
      for (let i = 0; i < imgExtensions.length; i++) {
        if (image.type.includes(imgExtensions[i])) {
          typePass = true
        }
      }
      errorMap.push({ expr: typePass, payload: "Image type not allowed!" })
    }

    const errors = evaluate(errorMap)
    this.setState({ error: errors.length > 0 ? errors[0] : "" })

    if (errors.length === 0) {
      reader.onloadend = () => {
        const imageBase64 = reader.result

        this.setState({
          image,
          imageBase64,
          openDialog: true
        })
      }
      reader.readAsDataURL(image)
      imageUploader.value = ""
    }
  }

  render() {
    const { openDialog, imageBase64 } = this.state
    const { src } = this.props
    return (
      <div id="imageUplaoderContainer" onClick={this.handleClickUploadImage}>
        <div className="vertical-center">
          <Image src={src} circular />
        </div>
        <input
          type="file"
          style={{ display: "none" }}
          ref="upload"
          onChange={this.handleImageUpload}
        />
        <h4 className="text-primary vertical-center">Upload Image</h4>
        <h6 className="text-muted text-center vertical-center">
          Maximum size allowed is 500kb<br />of PNG, JPEG, JPG.
        </h6>

        <Modal
          dimmer={openDialog}
          open={openDialog}
          onClose={this.close}
          size="tiny"
        >
          <Modal.Header>Cropping Image</Modal.Header>
          <Modal.Content>
            <Cropper src={imageBase64} ref="image" />
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="Crop"
              onClick={this.handleSubmit}
            />
            <Button color="black" onClick={this.handleClose}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

ImageUploader.propTypes = {
  src: PropTypes.string.isRequired,
  maxSize: PropTypes.number,
  imgExtensions: PropTypes.array,
  onUpload: PropTypes.func
}

ImageUploader.defaultProps = {
  maxSize: 500000,
  imgExtensions: ["jpg", "jpeg", "png"]
}

export default ImageUploader
