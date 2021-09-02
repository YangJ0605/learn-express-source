const express = require('./index')
const app = express()

app.use('/use', (req, res, next) => {
  console.log('1')
  next()
},(req, res, next) => {
  console.log('2')
  next()
},(req, res, next) => {
  res.end('hello express')
  // next()
})

app.get('/abc', (req, res, next) => {
  console.log('/abc')
  next()
}, (req, res, next) => {
  res.end(JSON.stringify(req.stack))
})

app.post('/abc', (req, res, next) => {
  console.log('post /abc')
  next()
}, (req, res, next) => {
  res.end(JSON.stringify(req.stack))
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})