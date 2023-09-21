import { createElement } from './dom'
import { type Position, type Size, type State } from '../types'
import { CLASS_NAME } from '../config/constants'

export default class NavCanvas {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private width: number = 0
  private height: number = 0
  private readonly maxSize: number = 200

  private readonly bg: HTMLDivElement
  el: HTMLDivElement

  scale: number = 0
  areaSize: Size = [0, 0]
  frameSize: Size = [0, 0]
  framePosition: Position = [0, 0]

  viewportSize: Size = [0, 0]

  areaPosition: Position = [0, 0]
  startPosition: Position = [0, 0]

  state: State = {
    img: '',
    position: [0, 0],
    scale: 0,
    angle: 0,
    originalSize: [0, 0],
    currentSize: [0, 0],
    viewportSize: [0, 0]
  }

  constructor () {
    const oWrapper = createElement('div', {
      class: CLASS_NAME['nav-canvas-wrapper']
    })

    const oBg = createElement('div', {
      class: CLASS_NAME['nav-canvas-bg']
    })

    const oCanvas = createElement('canvas', {
      class: CLASS_NAME['nav-canvas']
    })

    oWrapper.appendChild(oBg)
    oWrapper.appendChild(oCanvas)

    this.canvas = oCanvas
    this.ctx = oCanvas.getContext('2d') as CanvasRenderingContext2D

    this.el = oWrapper
    this.bg = oBg

    this.initEvent()
  }

  initEvent (): void {
    const { el } = this

    el.addEventListener('mousedown', this.handleMousedown.bind(this), false)
  }

  initSize (angle: number): Size {
    const { el, bg, canvas, width, height, maxSize } = this
    let scale = 1
    let w = width
    let h = height

    if (width > height) {
      if (width > maxSize) {
        scale = maxSize / width
        w = maxSize
        h = height * scale
      }
    } else {
      if (height > maxSize) {
        scale = maxSize / height
        h = maxSize
        w = width * scale
      }
    }

    this.areaSize = [w, h]

    canvas.width = w
    canvas.height = h

    el.style.width = `${w}px`
    el.style.height = `${h}px`

    // fixed width and height.
    if (angle % 180 !== 0) {
      bg.style.backgroundSize = `${h}px ${w}px`
      bg.style.width = `${h}px`
      bg.style.height = `${w}px`
    } else {
      bg.style.backgroundSize = `${w}px ${h}px`
      bg.style.width = `${w}px`
      bg.style.height = `${h}px`
    }

    return [w, h]
  }

  setState (state: State): void {
    this.state = state
    const {
      img,
      angle,
      originalSize,
      scale,
      viewportSize: [vw, vh],
      currentSize: [cw, ch],
      position: [left, top]
    } = state

    this.width = originalSize[0]
    this.height = originalSize[1]
    this.scale = Math.max(1 / scale)
    this.viewportSize = [vw, vh]

    const [width, height] = this.initSize(angle)

    // negative direction
    this.framePosition = [
      -1 * left * width / cw,
      -1 * top * height / ch
    ]

    this.frameSize = [
      width * vw / cw,
      height * vh / ch
    ]

    this.setImage(img, angle)
    this.show(cw > vw || ch > vh)
    this.draw()
  }

  setImage (src: string, angle: number): void {
    this.bg.style.backgroundImage = `url(${src})`
    this.bg.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`
  }

  show (visible: boolean): void {
    this.el.style.visibility = visible ? 'visible' : 'hidden'
  }

  draw (): void {
    this.clearRect()
    this.drawMask()
    this.drawRealFrame()
  }

  drawMask (): void {
    const { ctx, width, height } = this
    ctx.fillStyle = 'rgba(255,255,255,.5)'
    ctx.fillRect(0, 0, width, height)
  }

  drawRealFrame (): void {
    const {
      ctx,
      frameSize: [frameWidth, frameHeight],
      areaSize: [areaWidth, areaHeight],
      framePosition: [left, top]
    } = this

    ctx.save()
    ctx.translate(areaWidth / 2 + left, areaHeight / 2 + top)
    ctx.strokeStyle = '#0098ff'
    ctx.lineWidth = 1
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillRect(-frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight)
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeRect(-frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight)
    ctx.restore()
  }

  clearRect (): void {
    const { areaSize: [width, height], ctx } = this
    ctx.clearRect(0, 0, width, height)
  }

  handleMousedown (e: MouseEvent): void {
    e.preventDefault()

    const { clientX, clientY } = e

    this.startPosition = [clientX, clientY]

    const onMouseMove = this.handleMousemove.bind(this)

    document.addEventListener('mousemove', onMouseMove, false)
    document.addEventListener('mouseup', (e: MouseEvent) => {
      this.handleMouseup(e)
      document.removeEventListener('mousemove', onMouseMove, false)
    }, { capture: false, once: true })
  }

  handleMousemove (e: MouseEvent): void {
    e.preventDefault()

    this.setAreaMove(e)
    // this.startPosition = [clientX, clientY]
  }

  handleMouseup (e: MouseEvent): void {
    e.preventDefault()

    this.setAreaMove(e, true)
  }

  setAreaMove (e: MouseEvent, isUp: boolean = false): void {
    const {
      startPosition: [sx, sy],
      areaPosition: [ax, ay],
      viewportSize: [vw, vh],
      areaSize: [aw, ah]
    } = this
    const { clientX, clientY } = e

    let [left, top] = [ax + clientX - sx, ay + clientY - sy]

    // position right === 60
    left = Math.min(60, Math.max(60 - (vw - aw), left))
    // position top === 60
    top = Math.min(60, Math.max(60 - (vh - ah), top))

    this.el.style.transform = `translate(${left}px, ${top}px)`

    if (isUp) {
      this.areaPosition = [left, top]
    }
  }
}
