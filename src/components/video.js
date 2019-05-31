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
  }

  play = (e) => {
    e.preventDefault()
    const { id, stream } = this.props
    if (id && stream) {
      this.video.play()
    }
  }

  pause = (e) => {
    e.preventDefault()
    this.video.pause()
  }

  render() {
    const { id, width } = this.props
    return (
      <div>
        <div className="video-wrap">
          <video id={id} />
          <button type="button" onClick={(e) => { this.play(e) }}>play</button>
          <button type="button" onClick={(e) => { this.pause(e) }}>pause</button>
        </div>
        <style jsx>{`
          .hero {
            width: 100%;
            color: #333;
          }
          video {
            display: block;
            width: 100%;
          }
          .video-wrap {
            width: ${width.width};
            float: left;
          }
        `}
        </style>
      </div>
    )
  }
}

export default Video
