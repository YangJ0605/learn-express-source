const { parse } = require('url')
const methods = require('methods')
// const pathToRegexp = require('path-to-regexp')
const Layer = require('./layer')
const Route = require('./route')

function Router() {
  this.stack = []
}

methods.forEach(method => {
  Router.prototype[method] = function (path, handlers) {
    // this.stack.push({
    //   path,
    //   method,
    //   handler
    // })
    // const layer = new Layer(path, handler)
    // layer.method = method
    // this.stack.push(layer)
    const route = new Route()
    const layer = new Layer(path, route.dispatch.bind(route))
    layer.route = route
    this.stack.push(layer)
    route[method](path, handlers)
  }
})

Router.prototype.handle = function (req, res) {
  const { pathname } = parse(req.url)
  const method = req.method.toLocaleLowerCase()
  let index = 0

  const next = () => {
    console.log(this.stack.length)
    if (index >= this.stack.length) {
      return res.end('can not handle ' + pathname)
    }
    const layer = this.stack[index++]
    const match = layer.match(pathname)
    if (match) {
      req.params = req.params || {}
      Object.assign(req.params, layer.params)
    }
    if (match) {
      console.log('44444444')
      return layer.handler(req, res, next)
    }
    next()
  }

  next()

  // const layer = this.stack.find(layer => {
  //   // const keys = []
  //   // const regexp = pathToRegexp(route.path, keys, {})
  //   // console.log(pathname, route.path)
  //   const match = layer.match(pathname)
  //   if (match) {
  //     req.params = req.params || {}
  //     Object.assign(req.params, layer.params)
  //   }
  //   // console.log(match)
  //   return match && layer.method === method
  // })
  // if (layer) {
  //   return layer.handler(req, res)
  // }
  // res.end('404 not found')
}

Router.prototype.use = function (path, handlers) {
  if (typeof path === 'function') {
    handlers.unshift(path)
    path = '/'
  }
  handlers.forEach(handler => {
    const layer = new Layer(path, handler)
    layer.isUseMiddleware = true
    this.stack.push(layer)
  })
}

module.exports = Router
