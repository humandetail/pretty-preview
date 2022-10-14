// class prefix
export const PREFIX = 'pretty-preview-'

type ClassMapType = [
  'container', 'mask', 'body', 'canvas',
  'btn', 'btn-close', 'btn-switch-left', 'btn-switch-right', 'btn-switch-disabled',
  'operations', 'btn-turn-left', 'btn-turn-right', 'btn-minus', 'scale-percent', 'btn-plus',
  'btn-scale', 'btn-scale-to-large', 'btn-scale-to-original',
  'wrapper', 'img',
  'nav-canvas-wrapper', 'nav-canvas-bg', 'nav-canvas'
]
type ResultType<T extends ClassMapType, D = T[number], P extends string = typeof PREFIX> = {
  [K in D as K extends string ? K : never]: K extends string ? `${P}${K}` : never
}

export const CLASS_NAME = (() => {
  const classMap: ClassMapType = [
    'container', 'mask', 'body', 'canvas',
    'btn', 'btn-close', 'btn-switch-left', 'btn-switch-right', 'btn-switch-disabled',
    'operations', 'btn-turn-left', 'btn-turn-right', 'btn-minus', 'scale-percent', 'btn-plus',
    'btn-scale', 'btn-scale-to-large', 'btn-scale-to-original',
    'wrapper', 'img',
    'nav-canvas-wrapper', 'nav-canvas-bg', 'nav-canvas'
  ]

  return classMap.reduce((prev, item) => {
    prev[item] = `${PREFIX}${item}`
    return prev
  }, {} as any) as ResultType<ClassMapType>
})()
