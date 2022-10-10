import { createElement } from './dom'

export interface NavCanvasOptions {
  width: number
  height: number
  scale: number
}

export default class NavCanvas {
  readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private width: number
  private height: number

  private readonly maxSize: number = 200

  scale: number = 0
  areaSize: [number, number] = [0, 0]
  position: [number, number] = [0, 0]

  constructor ({
    width,
    height,
    scale
  }: NavCanvasOptions) {
    const oCanvas = createElement('canvas', {
      class: 'pretty-preview-nav-canvas'
    })

    this.canvas = oCanvas
    this.ctx = oCanvas.getContext('2d') as CanvasRenderingContext2D
    this.width = width
    this.height = height
    this.scale = scale

    this.init()
  }

  init (): void {
    const { canvas, width, height, maxSize } = this
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

    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    canvas.style.backgroundSize = `${w}px ${h}px`
  }

  setImage (src: string, width: number, height: number): void {
    const oImg = new Image()

    const { canvas } = this

    oImg.onload = () => {
      canvas.style.backgroundImage = `url(${src})`
      this.width = width
      this.height = height
      this.init()
      this.draw()
    }

    oImg.src = src
  }

  show (visible: boolean): void {
    this.canvas.style.visibility = visible ? 'visible' : 'hidden'
  }

  setScale (scale: number): void {
    this.scale = Math.min(1, 1 / scale)
    if (this.scale < 1) {
      this.show(true)
      this.draw()
    } else {
      this.show(false)
    }
  }

  setPosition ([left, top]: [number, number], [largeWidth, largeHeight]: [number, number]): void {
    const { areaSize: [width, height] } = this

    this.position = [
      left * (width / largeWidth),
      top * (height / largeHeight)
    ]
    if (this.scale < 1) {
      this.show(true)
      this.draw()
    } else {
      this.show(false)
    }
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
      areaSize: [width, height],
      scale,
      position: [left, top]
    } = this

    const w = width * scale
    const h = height * scale
    let x = -left + width / 2
    let y = -top + height / 2

    // Make sure the frame is not outside the area.
    while (x - (w / 2) <= 0) {
      x += 1
    }
    while (x + (w / 2) >= width) {
      x -= 1
    }

    while (y - (h / 2) <= 0) {
      y += 1
    }
    while (y + (h / 2) >= height) {
      y -= 1
    }

    ctx.save()
    ctx.translate(x, y)
    ctx.strokeStyle = '#0098ff'
    ctx.lineWidth = 1
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillRect(-w / 2, -h / 2, w, h)
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeRect(-w / 2, -h / 2, w, h)
    ctx.restore()
  }

  clearRect (): void {
    const { width, height, ctx } = this
    ctx.clearRect(0, 0, width, height)
  }
}
