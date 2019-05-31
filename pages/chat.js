import React from 'react'
import io from 'socket.io-client'
import Head from '../src/components/head'
import Nav from '../src/components/nav'
import Video from '../src/components/video'

class Chat extends React.Component {
  socket = null

  video = null

  peer = null

  constructor(props) {
    super(props)
    this.state = {
      socketId: null,
      mediaStream: null,
      remoteStreams: [],
    }
  }

  static async getInitialProps() {
    return {}
  }

  componentDidMount() {
    this.video = document.getElementById('myelement')

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
      .then((mediaStream) => {
        this.setState({ mediaStream })
        this.socket = io()
        this.socket.on('connect', () => {
          const options = {
            host: window.location.hostname,
            port: window.location.port,
            path: '/api',
          }
          this.peer = new Peer(this.socket.id, options)
          this.setState({ socketId: this.socket.id })
          this.peer.on('call', (call) => {
            console.log(`${call.peer}にcallされました`)
            call.answer(mediaStream)
          })
        })

        this.socket.on('keys', (keys) => {
          const index = keys.indexOf(this.socket.id)
          if (index > -1) {
            keys.splice(index, 1) // 自分自身を無視
          }
          keys.map((key) => {
            const { mediaStream } = this.state
            const call = this.peer.call(key, mediaStream)
            if (!call) {
              return console.log(`${key} isn't find`)
            }
            call.on('stream', (remoteStream) => {
              const { remoteStreams } = this.state
              console.log('connect remotestreams', remoteStreams)
              const findex = remoteStreams.findIndex(st => st.id === key)
              if (findex === -1) {
                remoteStreams.push({
                  id: key,
                  stream: remoteStream,
                })
              }
              else {
                remoteStreams[findex] = {
                  id: key,
                  stream: remoteStream,
                }
              }
              this.setState({ remoteStreams })
            })
          })
        })

        this.socket.on('deleteKeys', (keys) => {
          const { remoteStreams } = this.state
          console.log('disconnect remotestreams', remoteStreams)
          keys.map((key) => {
            remoteStreams.forEach((stream, index) => {
              if (stream.id === key) {
                console.log('delete', key)
                remoteStreams.splice(index, 1)
                this.setState({ remoteStreams })
              }
            })
          })
        })
      })
      .catch((e) => {
        console.error(e)
      })
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
    const {
      socketId,
      mediaStream,
      remoteStreams,
    } = this.state
    console.log(!socketId)
    return (
      <div>
        <Head title="Chat" />
        <Nav />
        <Video id={socketId} stream={mediaStream} width={{ width: '20%' }} />
        { remoteStreams.map(stream => <Video id={stream.id} stream={stream.stream} width={{ width: '40%' }} />)}
        <script src="https://unpkg.com/peerjs@1.0.0/dist/peerjs.min.js" />
      </div>
    )
  }
}

export default Chat
