const express = require('express')
const https = require('https')
const fs = require('fs')
const createIo = require('socket.io')
const createPeerServer = require('peer').ExpressPeerServer
const next = require('next')

// Environment
const port = process.env.PORT || 3000
const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
}

// Routes
const app = express()
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const httpsServer = https.createServer(options, app)
const io = createIo(httpsServer)
const peerServer = createPeerServer(httpsServer)

app.use('/api', peerServer)
app.use(express.static(__dirname))

// Boot
httpsServer.listen(port, () => {
  console.log(`Boot on https://localhost:${port}`)
})

const keys = []
peerServer.on('connection', (key) => {
  keys.push(key)

  console.log('connected', keys)

  io.emit('keys', keys)
})
peerServer.on('disconnect', (key) => {
  const index = keys.indexOf(key)
  if (index > -1) {
    keys.splice(index, 1)
  }
  console.log('disconnect', keys)

  io.emit('deleteKeys', keys)
})

nextApp.prepare()
  .then(() => {
    app.get('*', (req, res) => handle(req, res))
    httpsServer.listen(3000, () => {
      console.log('listening on *:3000')
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
