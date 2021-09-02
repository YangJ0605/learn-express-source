const http = require('http')
const methods = require('methods')

const Router = require('./router')

function App() {
  // this.routes = []
  this._router = new Router()
}

// console.log(methods)

methods.forEach(method => {
  App.prototype[method] = function (path, ...handlers) {
    this._router[method](path, handlers)
  }
})

App.prototype.use = function (path, ...handlers) {
  this._router.use(path, handlers)
}

let index = 0

App.prototype.listen = function (...args) {
  const server = http.createServer((req, res) => {
    console.log('--listen--', index++)
    this._router.handle(req, res)
  })

  server.listen(...args)
}

module.exports = App
