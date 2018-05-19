# Eventilator: but can your event manager do this?

## API:
```js
  eventilator(
    once Boolean,
    target EventTarget|String,
    handle Function,
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
  const handle = on.anyEvent(target, (event, target) => {
    count++
  })

  handle.emit('anyEvent')
  handle.off()
  handle.emit('anyEvent')
  handle.on()
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

  try {
    await someUnavailableOperation()
  } catch (e) {
    handles.click.off()
  }
```
