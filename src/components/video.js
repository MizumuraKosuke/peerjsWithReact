import React from 'react'

class Video extends React.Component {
  video = null

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate() {
    const { id, stream } = this.props
    console.log(id, stream)
    if (!id || !stream) { return }
    this.video = document.getElementById(id)
    this.mediaStream = stream
    this.video.srcObject = this.mediaStream
    this.video.onloadedmetadata = () => {
      this.video.play()
    }
  }

  play = (e) => {
    e.preventDefault()
    this.video.play()
  }

  pause = (e) => {
    e.preventDefault()
    this.video.pause()
  }

  render() {
    const { id, width } = this.props
    return (
      <div>
        <video id={id} style={width} />
        <button type="button" onClick={(e) => { this.play(e) }}>play</button>
        <button type="button" onClick={(e) => { this.pause(e) }}>pause</button>
      </div>
    )
  }
}

export default Video
