# Eventilator: but can your event manager do this?

## API:
```js
  eventilator(
    once Boolean,
    target EventTarget|String|Array,
    type String|Object<String, Function>,
    =handle Function,
    =options Boolean|Object = false
  )
```
* ``.on/once['any-event-name'] | .on/once(target, event, handle, options)`` - add listener
* ``.on/once(target, { event: handle })`` - add listeners
* ``.off(target, event, handle) | handle.off`` - remove listener
* ``.emit(target, type, detail) | handle.emit(type, detail)`` - emit event
* ``.curry`` - extra (used internally but why not share)

```js
  const {on, once} = eventilator

  let count = 0
  const handle = on.anyEvent('div.target', (event, target) => {
    count++
  })

  console.log(handle.target instanceof Element)

  handle.emit('anyEvent')
  handle.off() // same as handle == handle.off
  
  console.log(`
    The handler is currently ${handle.ison ? 'on' : 'off'}.
  `)

  handle.emit('anyEvent')
  handle.on()

  console.log(`
    The handler is currently ${handle.ison ? 'on' : 'off'}.
  `)

  handle.emit('anyEvent')


  setTimeout(() => {
    console.log(`The count should be 2 it is ${count}`)
  }, 5)
```

```js
  const {on, once} = eventilator

  const handles = once('div.fancy-element', {
    click (event, fancyElement) {},
    keydown (event, fancyElement) {}
  })

  const {
    click: {off: clickOff},
    keydown: {off: keydownOff}
  } = handles

  try {
    await someUnavailableOperation()
  } catch (e) {
    handles.click.off()
  }
```

Arrays or Selectors finding multiple elements works as well.
```js
const [aHndl, bHndl, cHndl] = on.pointerover([a, b, c], (e, elementX) => {
  // do something
})

aHndl.off()
bHndl.off()
cHndl.off()

// or
const handlers = on.pointerover('main > div.fancy-card', (e, cardDiv) => {
  // do something
})
handlers.off() // <- loops over each and turns'em off
```
