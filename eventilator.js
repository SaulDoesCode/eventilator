(root => {
  const curry = (fn, arity = fn.length, ...args) => arity <= args.length
    ? fn(...args)
    : curry.bind(undefined, fn, arity, ...args)

  const listen = (once, target, type, fn, options = false) => {
    if (typeof target === 'string') {
      target = root.document.querySelectorAll(target)
      target = target.length === 1 ? target[0] : Array.from(target)
    }
  
    if (Array.isArray(target) ? !target.length : !target.addEventListener) {
      throw new Error('nil/empty event target(s)')
    }
  
    let typeobj = type != null && type.constructor === Object
    if (type == null || !(typeobj || typeof type === 'string')) {
      throw new TypeError('cannot listen to nil or invalid event type')
    }

    if (Array.isArray(target)) {
      for (let i = 0; i < target.length; i++) {
        target[i] = listen(
          once, target[i], typeobj ? Object.assign({}, type) : type, fn, options
        )
      }
      return target
    }
  
    if (typeobj) {
      for (const name in type) {
        type[name] = listen(once, target, name, type[name], options)
      }
      target.off = () => {
        for (const h of target) h()
        return target
      }
      target.on = mode => {
        for (const h of target) h.on(mode)
        return target
      }
      return type
    }
  
    function wrapper () {
      fn.call(this, ...arguments, target)
      if (off.once) off()
    }
  
    const on = mode => {
      if (mode != null && mode !== off.once) off.once = !!mode
      target.addEventListener(type, wrapper, options)
      off.ison = true
      return off
    }
  
    const off = Object.assign(() => {
      target.removeEventListener(type, wrapper)
      off.ison = false
      return off
    }, {
      target,
      on,
      once,
      emit: eventilator.emit.bind(target, target)
    })
    off.off = off
  
    return on()
  }

  const eventilator = curry(listen, 3)

  eventilator.curry = curry
  eventilator.once = listen.bind(null, true)
  eventilator.on = listen.bind(null, false)
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
    : root.define instanceof Function && root.define.amd
      ? root.define(['eventilator'], () => eventilator)
      : root.eventilator = eventilator
})(typeof global !== 'undefined' ? global : window)
