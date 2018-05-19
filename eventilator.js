(root => {
  const curry = (fn, arity = fn.length, ...args) => arity <= args.length
    ? fn(...args)
    : curry.bind(undefined, fn, arity, ...args)

  const eventilator = curry((once, target, type, handle, options = false) => {
    if (typeof target === 'string') target = root.document.querySelector(target)
    if (type === Object(type)) {
      for (const name in type) {
        type[name] = eventilator(once, target, name, type[name], options)
      }
      return type
    }
    if (typeof handle !== 'function') {
      return eventilator.bind(undefined, once, target, type)
    }
    let isOn = false
    handle = handle.bind(target)

    const handler = evt => {
      handle(evt, target)
      once && remove()
    }

    const remove = () => {
      target.removeEventListener(type, handler)
      isOn = false
      return manager
    }

    const add = mode => {
      if (isOn) remove()
      once = !!mode
      target.addEventListener(type, handler, options)
      isOn = true
      return manager
    }

    const manager = {
      get isOn () { return isOn },
      on: add,
      off: remove,
      once: add.bind(undefined, true),
      emit (type, detail) {
        target.dispatchEvent(new root.CustomEvent(type, {detail}))
        return manager
      }
    }

    return add(once)
  }, 3)

  eventilator.curry = curry
  eventilator.once = eventilator(true)
  eventilator.on = eventilator(false)
  eventilator.emit = (target, type, detail) => {
    target.dispatchEvent(new root.CustomEvent(type, {detail}))
  }

  if (root.Proxy) {
    const PC = { // Proxy Configuration
      get: (fn, type) => (tgt, hndl, opts) => fn(tgt, type, hndl, opts)
    }
    eventilator.once = new root.Proxy(eventilator.once, PC)
    eventilator.on = new root.Proxy(eventilator.on, PC)
  }

  typeof module !== 'undefined'
    ? module.exports = eventilator
    : typeof define === 'function' && root.define.amd
      ? root.define(['eventilator'], () => eventilator)
      : root.eventilator = eventilator
})(typeof global !== 'undefined' ? global : window)
