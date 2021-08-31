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

App.prototype.listen = function (...args) {
  const server = http.createServer((req, res) => {
    this._router.handle(req, res)
  })

  server.listen(...args)
}

module.exports = App
