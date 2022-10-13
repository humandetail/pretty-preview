import { CLASS_NAME } from './config/constants'
import NavCanvas from './utils/NavCanvas'
import { createBtn, createElement } from './utils/dom'
import { Position, PrettyPreviewOptions, Size, State } from './types'

class PrettyPreview {
  private readonly rootEl: HTMLElement
  private readonly previewSrcList: string[] = []
  private readonly imgs: HTMLElement[] = []

  private container: HTMLDivElement | null = null

  private useMask: boolean = true

  readonly viewportSize: Size = [window.innerWidth, window.innerHeight]
  startPosition: Size = [0, 0]

  #idx: number = -1
  /** original size */
  #imageSize: Size = [0, 0]
  #showOriginalScale: boolean = false
  #angle: number = 0
  #wrapperPosition: Size = [0, 0]
  #scalePercent: number = 100
  defaultScalePercent: number = 50

  currentImage?: HTMLImageElement
  currentImageWrapper?: HTMLDivElement

  navCanvas?: NavCanvas

  constructor (options: PrettyPreviewOptions = {}) {
    const {
      root = document.body,
      selector = 'img',
      srcAttr = 'src'
    } = options

    const rootEl = typeof root === 'string'
      ? document.querySelector(root)
      : root

    if (!rootEl) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
      throw new TypeError(`root element expeact a HTMLElement or a selector, but got '${root}'`)
    }

    this.rootEl = rootEl as HTMLElement

    const imgs = this.rootEl.querySelectorAll<HTMLElement>(selector)

    imgs.forEach(img => {
      const attr = img.getAttribute(srcAttr)
      this.imgs.push(img)
      if (attr) {
        this.previewSrcList.push(attr)
      }
    })

    this.initOptions(options)
    this.initEvent()
  }

  get idx (): number {
    return this.#idx
  }

  set idx (idx: number) {
    const { previewSrcList } = this
    const index = Math.min(previewSrcList.length - 1, Math.max(-1, idx))

    if (index === this.#idx) {
      return
    }

    this.#idx = index

    void Promise.resolve().then(() => {
      const oSwitchLeftBtn = document.querySelector(`.${CLASS_NAME['btn-switch-left']}`)
      const oSwitchRightBtn = document.querySelector(`.${CLASS_NAME['btn-switch-right']}`)

      if (oSwitchLeftBtn) {
        oSwitchLeftBtn.classList[index <= 0 ? 'add' : 'remove'](`${CLASS_NAME['btn-switch-disabled']}`)
      }

      if (oSwitchRightBtn) {
        oSwitchRightBtn.classList[index >= (previewSrcList.length - 1) ? 'add' : 'remove'](`${CLASS_NAME['btn-switch-disabled']}`)
      }

      if (this.currentImage) {
        this.setCurrentImageTransform('default')
        this.currentImage.src = previewSrcList[idx]
        this.currentImage.style.transition = 'transform .4s'
      }

      this.wrapperPosition = [0, 0]

      if (this.navCanvas) {
        this.navCanvas.setState(this.currentState)
      }
    })
  }

  get scalePercent (): number {
    return this.#scalePercent
  }

  set scalePercent (val: number) {
    this.#scalePercent = Math.max(3, val)

    const oScalePercent = document.querySelector(`.${CLASS_NAME['scale-percent']}`)

    if (oScalePercent) {
      oScalePercent.innerHTML = `${val}%`
    }

    this.setCurrentImageTransform('scale', `${val / 100}`)
    this.setWrapperPosition()

    if (this.navCanvas) {
      this.navCanvas.setState(this.currentState)
    }
  }

  get showOriginalScale (): boolean {
    return this.#showOriginalScale
  }

  set showOriginalScale (bool: boolean) {
    this.#showOriginalScale = bool
    this.scalePercent = bool ? this.defaultScalePercent : 100

    this.wrapperPosition = [0, 0]

    const oScaleBtns = document.querySelectorAll(`.${CLASS_NAME['btn-scale']}`)

    oScaleBtns.forEach(btn => {
      if (btn.classList.contains(`${CLASS_NAME['btn-scale-to-large']}`)) {
        void Promise.resolve().then(() => {
          (btn as HTMLElement).style.cssText = bool ? 'display: none' : ''
        })
      } else {
        void Promise.resolve().then(() => {
          (btn as HTMLElement).style.cssText = bool ? '' : 'display: none'
        })
      }
    })
  }

  get angle (): number {
    return this.#angle
  }

  set angle (angle: number) {
    this.#angle = angle

    this.setCurrentImageTransform('rotate', `${angle}deg`)

    // exchange width and height
    const [width, height] = this.imageSize
    this.imageSize = [height, width]

    // When the Angle is changed,
    // the scale and position should be set to default values.
    this.scalePercent = this.defaultScalePercent
    this.wrapperPosition = [0, 0]

    if (this.navCanvas) {
      this.navCanvas.setState(this.currentState)
    }
  }

  get wrapperPosition (): Size {
    return this.#wrapperPosition
  }

  set wrapperPosition (position: Position) {
    this.#wrapperPosition = position

    let { currentImageWrapper } = this

    if (!currentImageWrapper) {
      currentImageWrapper = document.querySelector(`.${CLASS_NAME.wrapper}`) as HTMLDivElement
    }

    if (currentImageWrapper) {
      currentImageWrapper.style.transform = `translate(${position[0]}px, ${position[1]}px)`
    }

    if (this.navCanvas) {
      this.navCanvas.setState(this.currentState)
    }
  }

  get imageSize (): Size {
    return this.#imageSize
  }

  set imageSize (size: Size) {
    this.#imageSize = size
  }

  get currentImageSize (): Size {
    const { scalePercent, imageSize: [width, height] } = this
    const scale = scalePercent / 100

    return [
      width * scale,
      height * scale
    ]
  }

  get currentState (): State {
    const {
      wrapperPosition,
      scalePercent,
      angle,
      idx,
      previewSrcList,
      imageSize,
      currentImageSize,
      viewportSize
    } = this

    return {
      img: previewSrcList[idx],
      position: wrapperPosition,
      scale: scalePercent / 100,
      angle,
      originalSize: imageSize,
      currentSize: currentImageSize,
      viewportSize
    }
  }

  initOptions (options: PrettyPreviewOptions): void {
    const {
      useMask = true
    } = options

    this.useMask = useMask
  }

  initEvent (): void {
    this.rootEl.addEventListener('click', this.handleClick.bind(this), false)
  }

  setCurrentImageTransform (props: 'default' | 'scale' | 'rotate', value: string = ''): void {
    const { currentImage } = this

    if (currentImage) {
      if (props === 'default') {
        currentImage.style.transform = 'scale(1) rotate(0)'
        return
      }

      const reg = new RegExp(`(${props}\\(.*?\\))`)
      currentImage.style.transform = (currentImage.style.transform || 'scale(1) rotate(0)').replace(reg, `${props}(${value})`)
    }
  }

  setBodyOverflow (hidden: boolean = false): void {
    document.body.style.overflow = hidden ? 'hidden' : 'unset'
  }

  setWrapperPosition (): void {
    const {
      viewportSize: [innerWidth, innerHeight],
      currentImageSize: [currentWidth, currentHeight],
      wrapperPosition
    } = this

    let [x, y] = wrapperPosition

    if (currentWidth <= innerWidth) {
      x = 0
    } else {
      x = Math.min((currentWidth - innerWidth) / 2, Math.max((innerWidth - currentWidth) / 2, x))
    }

    if (currentHeight <= innerHeight) {
      y = 0
    } else {
      y = Math.min((currentHeight - innerHeight) / 2, Math.max((innerHeight - currentHeight) / 2, y))
    }

    this.wrapperPosition = [x, y]
  }

  handleImgLoaded (e: Event): void {
    const target = e.target as HTMLImageElement
    if (target) {
      const { naturalWidth, naturalHeight } = target
      const [width, height] = this.viewportSize

      // 计算比例
      const widthRadio = width / naturalWidth
      const heightRadio = height / naturalHeight
      const radio = widthRadio < heightRadio ? widthRadio : heightRadio

      if (radio < 1) {
        this.defaultScalePercent = Number((radio * 100).toFixed(0))
      } else {
        this.defaultScalePercent = 100
      }

      this.imageSize = [naturalWidth, naturalHeight]

      if (!this.navCanvas) {
        if (this.container) {
          this.createNavCanvas(this.container)
        }
      }

      if (this.navCanvas) {
        this.navCanvas.setState(this.currentState)
        // this.navCanvas.setImage(this.previewSrcList[this.idx], naturalWidth, naturalHeight)
      }

      this.scalePercent = this.defaultScalePercent
    }
  }

  handleClick (e: MouseEvent): void {
    const target = e.target as HTMLElement

    if (target) {
      const idx = this.imgs.indexOf(target)
      if (idx !== -1) {
        this.setBodyOverflow(true)
        this.createContainer()
        this.idx = idx
      }
    }
  }

  handleCloseBtnClick (): void {
    if (this.container) {
      this.setBodyOverflow(false)
      document.body.removeChild(this.container)
      this.container = null
      this.navCanvas = undefined
      this.idx = -1
    }
  }

  handleSwitchBtnClick (type: 'left' | 'right'): void {
    switch (type) {
      case 'left':
        this.idx -= 1
        break
      case 'right':
        this.idx += 1
        break
      default:
        break
    }
  }

  handleOperationsBtnClick (e: MouseEvent): void {
    const target = e.target as HTMLElement

    if (target.classList.contains(`${CLASS_NAME.operations}`)) {
      return
    }

    let btn: HTMLElement | null = target
    while (btn && !btn.classList.contains(`${CLASS_NAME.btn}`)) {
      btn = btn.parentNode as HTMLElement
      if (btn.classList.contains(`${CLASS_NAME.operations}`)) {
        btn = null
      }
    }

    if (btn) {
      if (btn.classList.contains(`${CLASS_NAME['btn-scale']}`)) {
        this.showOriginalScale = !this.showOriginalScale
        return
      }

      if (btn.classList.contains(`${CLASS_NAME['btn-turn-left']}`)) {
        this.angle -= 90
        return
      }

      if (btn.classList.contains(`${CLASS_NAME['btn-turn-right']}`)) {
        this.angle += 90
        return
      }

      if (btn.classList.contains(`${CLASS_NAME['btn-minus']}`)) {
        this.handleChangeScalePercent('minus')
        return
      }

      if (btn.classList.contains(`${CLASS_NAME['btn-plus']}`)) {
        this.handleChangeScalePercent('plus')
      }
    }
  }

  handleChangeScalePercent (action: 'minus' | 'plus'): void {
    // 3 6 12 25 50 75 100
    const { scalePercent } = this

    if (scalePercent <= 3) {
      this.scalePercent = action === 'minus' ? 3 : 6
    } else if (scalePercent <= 6) {
      this.scalePercent = action === 'minus' ? 3 : scalePercent === 6 ? 12 : 6
    } else if (scalePercent <= 12) {
      this.scalePercent = action === 'minus' ? 6 : scalePercent === 12 ? 25 : 12
    } else if (scalePercent <= 25) {
      this.scalePercent = action === 'minus' ? 12 : scalePercent === 25 ? 50 : 25
    } else {
      this.scalePercent = action === 'minus' ? (Math.ceil(scalePercent / 25) - 1) * 25 : (Math.floor(scalePercent / 25) + 1) * 25
    }
  }

  handleMouseDown (e: MouseEvent): void {
    e.preventDefault()
    e.stopPropagation()

    const { clientX, clientY } = e
    this.startPosition = [clientX, clientY]

    const onMousemove = (e: MouseEvent): void => {
      this.handleMousemove(e)
    }

    const onMouseup = (e: MouseEvent): void => {
      this.handleMouseup(e)
      document.removeEventListener('mousemove', onMousemove, false)
      document.removeEventListener('mouseup', onMouseup, false)
    }

    document.addEventListener('mousemove', onMousemove, false)
    document.addEventListener('mouseup', onMouseup, false)
  }

  handleMousemove (e: MouseEvent): void {
    e.preventDefault()

    const { clientX, clientY } = e
    const {
      startPosition: [startClientX, startClientY],
      wrapperPosition: [currentX, currentY]
    } = this

    this.startPosition = [clientX, clientY]

    this.wrapperPosition = [currentX + (clientX - startClientX), currentY + (clientY - startClientY)]
  }

  handleMouseup (e: MouseEvent): void {
    e.preventDefault()

    this.setWrapperPosition()
  }

  handleMouseWheel (e: WheelEvent): void {
    e.preventDefault()
    e.stopPropagation()

    const { deltaY } = e
    this.scalePercent += deltaY > 0 ? -1 : 1
  }

  createContainer (): HTMLDivElement {
    const container = createElement('div', { class: `${CLASS_NAME.container}` })

    this.createMask(container)
    this.createPreviewBody(container)

    document.body.appendChild(container)

    this.container = container

    return container
  }

  createMask (container: HTMLDivElement): void {
    if (this.useMask) {
      const oMask = createElement('div', { class: `${CLASS_NAME.mask}` })

      container.appendChild(oMask)
    }
  }

  createPreviewBody (container: HTMLDivElement): void {
    const oBody = createElement('div', { class: `${CLASS_NAME.body}` })

    this.createCanvas(oBody)

    const oCloseBtn = createBtn('close', {
      class: `${CLASS_NAME.btn} ${CLASS_NAME['btn-close']}`
    })

    const oSwitchLeftBtn = createBtn('left', {
      class: `${CLASS_NAME.btn} ${CLASS_NAME['btn-switch-left']}`
    })

    const oSwitchRightBtn = createBtn('right', {
      class: `${CLASS_NAME.btn} ${CLASS_NAME['btn-switch-right']}`
    })

    oBody.appendChild(oCloseBtn)
    oBody.appendChild(oSwitchLeftBtn)
    oBody.appendChild(oSwitchRightBtn)

    this.createOperations(oBody)

    container.appendChild(oBody)

    oCloseBtn.addEventListener('click', this.handleCloseBtnClick.bind(this), false)
    oSwitchLeftBtn.addEventListener('click', this.handleSwitchBtnClick.bind(this, 'left'), false)
    oSwitchRightBtn.addEventListener('click', this.handleSwitchBtnClick.bind(this, 'right'), false)
  }

  createCanvas (container: HTMLDivElement): void {
    const oCanvas = createElement('div', { class: `${CLASS_NAME.canvas}` })
    const oWrapper = createElement('div', { class: `${CLASS_NAME.wrapper}` })
    const oImg = createElement('img', {
      class: `${CLASS_NAME.img}`
    })

    oWrapper.append(oImg)
    oCanvas.append(oWrapper)

    container.appendChild(oCanvas)

    this.currentImageWrapper = oWrapper
    this.currentImage = oImg

    oImg.addEventListener('load', this.handleImgLoaded.bind(this), false)
    oImg.addEventListener('mousedown', this.handleMouseDown.bind(this), false)
    oCanvas.addEventListener('wheel', this.handleMouseWheel.bind(this), false)
  }

  createOperations (container: HTMLDivElement): void {
    const { showOriginalScale } = this

    const oOperations = createElement('div', {
      class: `${CLASS_NAME.operations}`
    })

    oOperations.appendChild(createBtn('turnLeft', { class: `${CLASS_NAME.btn} ${CLASS_NAME['btn-turn-left']}` }))
    oOperations.appendChild(createBtn('turnRight', { class: `${CLASS_NAME.btn} ${CLASS_NAME['btn-turn-right']}` }))
    oOperations.appendChild(createBtn('minus', { class: `${CLASS_NAME.btn} ${CLASS_NAME['btn-minus']}` }))

    oOperations.appendChild(createElement('div', { class: `${CLASS_NAME['scale-percent']}` }, '', `${this.scalePercent}%`))

    oOperations.appendChild(createBtn('plus', { class: `${CLASS_NAME.btn} ${CLASS_NAME['btn-plus']}` }))
    oOperations.appendChild(createBtn('scaleToLarge', { class: `${CLASS_NAME.btn} ${CLASS_NAME['btn-scale']} ${CLASS_NAME['btn-scale-to-large']}` }, showOriginalScale ? 'display: none' : ''))
    oOperations.appendChild(createBtn('scaleToOriginal', { class: `${CLASS_NAME.btn} ${CLASS_NAME['btn-scale']} ${CLASS_NAME['btn-scale-to-original']}` }, showOriginalScale ? '' : 'display: none'))

    container.appendChild(oOperations)

    oOperations.addEventListener('click', this.handleOperationsBtnClick.bind(this), false)
  }

  createNavCanvas (container: HTMLDivElement): void {
    this.navCanvas = new NavCanvas()

    container.appendChild(this.navCanvas.el)
  }
}

export default PrettyPreview
