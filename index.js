var logger = require('status-logger')
var nanobus = require('nanobus')
var throttle = require('lodash.throttle')

module.exports = neatLog

function neatLog (views, opts) {
  if (!views) throw new Error('views required')
  if (!Array.isArray(views)) views = [views]
  if (!opts) opts = {}

  var logspeed = opts.logspeed || 250
  var state = {}
  var output = []
  var log = logger([], opts)
  var bus = nanobus()
  bus.on('render', throttle(render, logspeed))

  return {
    render: render,
    use: register
  }

  function register (cb) {
    cb(state, bus)
  }

  function render () {
    log.messages = []
    views.map(function (view) {
      return log.messages.push(view(state))
    })
    log.print()
  }
}

