const test = require('ava')

const listeners = new Map()
const target = {
  dispatchEvent (event) {
    if (listeners.has(event.type)) {
      listeners.get(event.type).forEach(handle => handle(event))
    }
  },
  addEventListener (type, handle, options) {
    if (!listeners.has(type)) listeners.set(type, new Set())
    listeners.get(type).add(handle)
  },
  removeEventListener (type, handle) {
    if (listeners.has(type)) {
      listeners.get(type).delete(handle)
      if (!listeners.get(type).size) {
        listeners.delete(type)
      }
    }
  }
}

global.document = {
  querySelector: () => target
}
global.CustomEvent = class CustomEvent {
  constructor (type, opts = {}) {
    this.type = type
    this.detail = opts.detail
  }
}

const eventilator = require('./eventilator.js')

test('.on, .emit and handle.off works', t => {
  const detail = 'see this?'
  t.plan(2)

  const handle = eventilator.on.event('div.fake-selector', e => {
    t.true(e.detail === detail)
  })

  eventilator.emit(target, 'event', detail)
  eventilator.emit(target, 'event', detail)

  handle.off()

  eventilator.emit(target, 'event', detail)
})

test('.once and handle.emit works', t => {
  const detail = 'see this?'
  t.plan(1)

  const handle = eventilator.once.event(target, e => {
    t.true(e.detail === detail)
  })

  handle.emit('event', detail)
  handle.emit('event', detail)
})

test('object of event handlers work', t => {
  t.plan(2)

  eventilator.on(target, {
    a () { t.pass() },
    b () { t.pass() }
  })

  eventilator.emit(target, 'a')
  eventilator.emit(target, 'a')
})
