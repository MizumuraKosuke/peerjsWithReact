import React from 'react'
import Link from 'next/link'
import io from 'socket.io-client'

import Head from '../src/components/head'
import Nav from '../src/components/nav'
import Video from '../src/components/video'

class Chat extends React.Component {
  socket = null

  video = null

  another = null

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
    this.another = document.getElementById('anotherelement')

    navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    })
      .then((mediaStream) => {
        console.log(mediaStream)
        this.setState({ mediaStream })
        this.socket = io()
        this.socket.on('connect', () => {
          const options = {
            host: location.hostname,
            port: location.port,
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
              remoteStreams.push({
                id: key,
                stream: remoteStream,
              })
              console.log(remoteStreams)
              this.setState({ remoteStreams })
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
    return (
      <div>
        <Head title="Chat" />
        <Nav />
        <Video id={socketId} stream={mediaStream} width={{ width: '30%' }} />
        { remoteStreams.map(stream => <Video id={stream.id} stream={stream.stream} width={{ width: '50%' }} />)}
        <script src="https://unpkg.com/peerjs@1.0.0/dist/peerjs.min.js" />
      </div>
    )
  }
}

export default Chat
