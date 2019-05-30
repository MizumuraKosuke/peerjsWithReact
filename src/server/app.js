const express = require('express')
const createHttpServer = require('http').createServer
const createIo = require('socket.io')
const createPeerServer = require('peer').ExpressPeerServer
const next = require('next')

// Environment
const port = process.env.PORT || 3000

// Routes
const app = express()
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const httpServer = createHttpServer(app)
const io = createIo(httpServer)
const peerServer = createPeerServer(httpServer)

app.use('/api', peerServer)
app.use(express.static(__dirname))

// Boot
httpServer.listen(port, () => {
  console.log(`Boot on http://localhost:${port}`)
})

const keys = []
peerServer.on('connection', (key) => {
  keys.push(key)

  console.log('connected', keys)

  io.emit('keys', keys)// 接続中の全てのクライアントへ`keys`イベントを発行
})
peerServer.on('disconnect', (key) => {
  const index = keys.indexOf(key)
  if (index > -1) {
    keys.splice(index, 1)
  }
  console.log('disconnect', keys)

  io.emit('keys', keys)// 同上
})

nextApp.prepare()
  .then(() => {
    app.get('*', (req, res) => handle(req, res))
    httpServer.listen(3000, () => {
      console.log('listening on *:3000')
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
