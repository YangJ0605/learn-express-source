const { parse } = require('url')
const methods = require('methods')
// const pathToRegexp = require('path-to-regexp')
const Layer = require('./layer')
const Route = require('./route')

function Router() {
  this.stack = []
}

// [
//   {
//     path: '/use',
//     keys: [],
//     "regexp": {
      
//     },
//     "params": {
      
//     },
//     "isUseMiddleware": Boolean
//   },
//   {
//     path: '/use',
//     keys: [],
//     "regexp": {
      
//     },
//     "params": {
      
//     },
//     "isUseMiddleware": Boolean
//   },
//   {
//     path: '/use',
//     keys: [],
//     "regexp": {
      
//     },
//     "params": {
      
//     },
//     "isUseMiddleware": Boolean
//   },
//   {
//     path: '/abc',
//     keys: [],
//     "regexp": {
      
//     },
//     "params": {
      
//     },
//     "isUseMiddleware": Boolean,
//     route: {
//       stack: [
//         {
//           "path": "/abc",
//           "keys": [
            
//           ],
//           "regexp": {
            
//           },
//           "params": {
            
//           },
//           "method": "get"
//         },
//         {
//           "path": "/abc",
//           "keys": [
            
//           ],
//           "regexp": {
            
//           },
//           "params": {
            
//           },
//           "method": "get"
//         }
//       ]
//     }
//   }
// ]

methods.forEach(method => {
  // 创建内层的route
  Router.prototype[method] = function (path, handlers) {
    const route = new Route()
    const layer = new Layer(path, route.dispatch.bind(route))
    layer.route = route
    this.stack.push(layer)
    route[method](path, handlers)
  }
})

Router.prototype.handle = function (req, res) {
  console.log(this.stack.length)
  const { pathname } = parse(req.url)
  const method = req.method.toLocaleLowerCase()
  let index = 0

  const next = () => {
    console.log('index', index)
    if (index >= this.stack.length) {
      return res.end('can not handle ' + pathname)
    }
    const layer = this.stack[index++]
    const match = layer.match(pathname)
    if (match) {
      req.params = req.params || {}
      req.stack = this.stack
      Object.assign(req.params, layer.params)
      return layer.handler(req, res, next)
    }
    next()
  }

  next()
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
