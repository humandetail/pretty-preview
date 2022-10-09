export function throttle (fn: (...args: any[]) => unknown, delay: number): () => unknown {
  let t: any = null
  let beginTime: number = new Date().getTime()

  return function () {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _self = this
    const args = [...arguments]
    const currentTime = new Date().getTime()

    clearTimeout(t)

    if (currentTime - beginTime >= delay) {
      fn.apply(_self, args)
      beginTime = currentTime
    } else {
      t = setTimeout(function () {
        fn.apply(_self, args)
      }, delay)
    }
  }
}
