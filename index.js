const app = require('express')()
const jwt = require('jsonwebtoken')
const http = require('http').createServer(app)
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { createUser } = require('./services/UserService')
const io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
})

let users = []

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

  socket.on(NEW_MESSAGE_EVENT, async (data) => {
    const response = await createUser(data)
    users.push(data)
    console.log(response)
  })

  socket.on('disconnect', () => {
    users.pop()
    console.log('disconnected')
  })
})

mongoose.connect('mongodb+srv://firepho:Auza940220.@cluster0.qlamj.mongodb.net/Kolegia?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
  if(err) console.log('Error conecting to database: ' + err)
  return true
})

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

