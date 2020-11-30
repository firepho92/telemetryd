const app = require('express')()
const jwt = require('jsonwebtoken')
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
})

const PORT = 8000
const NEW_MESSAGE_EVENT = 'clientErrorNotification' //puede cambiar o agregar mas

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

app.post('/', (req, res) => {
  const { user } = req.body
  console.log(user)
  const token = jwt.sign(user, 'Kolegia', {
    expiresIn: 60 * 60 * 24
  })
  console.log(token)
  res.status(200).send(token)
})

io.on('connection', (socket) => {
  console.log('connected')

  socket.on(NEW_MESSAGE_EVENT, (data) => {
    console.log(data)
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
  })
})

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

