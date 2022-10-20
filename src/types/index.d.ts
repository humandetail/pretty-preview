export interface PrettyPreviewOptions {
  root?: HTMLElement | string
  selector?: string
  srcAttr?: string
  useMask?: boolean
  loop?: boolean
}

export type Size = [number, number]
export type Position = [number, number]

export interface State {
  img: string
  position: Position
  scale: number
  angle: number
  originalSize: Size
  currentSize: Size
  viewportSize: Size
}
