import { createBtn, createElement } from './utils/dom'

export interface PrettyPreviewOptions {
  root?: HTMLElement | string
  selector?: string
  srcAttr?: string
  useMask?: boolean
  lazy?: boolean
}

class PrettyPreview {
  private readonly rootEl: HTMLElement
  private readonly previewSrcList: string[] = []
  private readonly imgs: HTMLElement[] = []

  private container: HTMLDivElement | null = null

  private useMask: boolean = true
  private lazy: boolean = true

  idx: number = -1
  #visible: boolean = false
  #scalePercent: number = 100
  #showOriginalScale: boolean = false

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

  get visible (): boolean {
    return this.#visible
  }

  set visible (val: boolean) {
    this.#visible = val

    let { container } = this

    if (!container) {
      container = this.createContainer()
    }

    container.style.opacity = val ? '1' : '0'
  }

  get scalePercent (): number {
    return this.#scalePercent
  }

  set scalePercent (val: number) {
    this.#scalePercent = val
  }

  get showOriginalScale (): boolean {
    return this.#showOriginalScale
  }

  set showOriginalScale (bool: boolean) {
    this.#showOriginalScale = bool

    const oScaleBtns = document.querySelectorAll('.pretty-preview-btn-scale')

    oScaleBtns.forEach(btn => {
      console.log(btn)
      if (btn.classList.contains('pretty-preview-btn-scale-to-large')) {
        (btn as HTMLElement).style.cssText = bool ? 'display: none' : ''
      } else {
        (btn as HTMLElement).style.cssText = bool ? '' : 'display: none'
      }
    })
  }

  initOptions (options: PrettyPreviewOptions): void {
    const {
      useMask = true,
      lazy = true
    } = options

    this.useMask = useMask
    this.lazy = lazy
  }

  initEvent (): void {
    console.log(this.imgs)
    this.rootEl.addEventListener('click', this.handleClick.bind(this), false)
  }

  handleClick (e: MouseEvent): void {
    const target = e.target as HTMLElement

    if (target) {
      console.log(target)

      const idx = this.imgs.indexOf(target)
      if (idx !== -1) {
        this.idx = idx
        this.visible = true
      }
    }
  }

  handleOperationsBtnClick (e: MouseEvent): void {
    const target = e.target as HTMLElement

    let btn: HTMLElement | null = target
    while (btn && !btn.classList.contains('pretty-preview-btn')) {
      btn = btn.parentNode as HTMLElement
      if (btn.classList.contains('pretty-preview-container')) {
        btn = null
      }
    }

    if (btn) {
      if (btn.classList.contains('pretty-preview-btn-scale')) {
        this.showOriginalScale = !this.showOriginalScale
        return
      }
      console.log('no contains')
    }
  }

  createContainer (): HTMLDivElement {
    const container = createElement('div', { class: 'pretty-preview-container' })

    this.createMask(container)
    this.createPreviewBody(container)

    document.body.appendChild(container)

    this.container = container

    return container
  }

  createMask (container: HTMLDivElement): void {
    if (this.useMask) {
      const oMask = createElement('div', { class: 'pretty-preview-mask' })

      container.appendChild(oMask)
    }
  }

  createPreviewBody (container: HTMLDivElement): void {
    const oBody = createElement('div', { class: 'pretty-preview-body' })

    this.createCanvas(oBody)

    oBody.appendChild(createBtn('close', {
      class: 'pretty-preview-btn pretty-preview-btn-close'
    }))
    oBody.appendChild(createBtn('left', {
      class: 'pretty-preview-btn pretty-preview-btn-switch-left'
    }))
    oBody.appendChild(createBtn('right', {
      class: 'pretty-preview-btn pretty-preview-btn-switch-right'
    }))

    this.createOperations(oBody)

    container.appendChild(oBody)
  }

  createCanvas (container: HTMLDivElement): void {
    const { previewSrcList, lazy } = this

    const oCanvas = createElement('div', { class: 'pretty-preview-canvas' })

    previewSrcList.forEach(src => {
      const oWrapper = createElement('div', { class: 'pretty-preview-wrapper' })
      const oImg = createElement('img', {
        [lazy ? 'data-src' : 'src']: src,
        class: 'pretty-perview-img'
      })

      oWrapper.append(oImg)
      oCanvas.append(oWrapper)
    })

    container.appendChild(oCanvas)
  }

  createOperations (container: HTMLDivElement): void {
    const { showOriginalScale } = this

    const oOperations = createElement('div', {
      class: 'pretty-preview-operations'
    })

    oOperations.appendChild(createBtn('turnLeft', { class: 'pretty-preview-btn pretty-preview-btn-turn-left' }))
    oOperations.appendChild(createBtn('turnRight', { class: 'pretty-preview-btn pretty-preview-btn-turn-left' }))
    oOperations.appendChild(createBtn('minus', { class: 'pretty-preview-btn pretty-preview-btn-minus' }))

    oOperations.appendChild(createElement('div', { class: 'pretty-preview-scale-percent' }, '', `${this.scalePercent}%`))

    oOperations.appendChild(createBtn('plus', { class: 'pretty-preview-btn pretty-preview-btn-plus' }))
    oOperations.appendChild(createBtn('scaleToLarge', { class: 'pretty-preview-btn pretty-preview-btn-scale pretty-preview-btn-scale-to-large' }, showOriginalScale ? 'display: none' : ''))
    oOperations.appendChild(createBtn('scaleToOriginal', { class: 'pretty-preview-btn pretty-preview-btn-scale pretty-preview-btn-scale-to-original' }, showOriginalScale ? '' : 'display: none'))

    container.appendChild(oOperations)

    oOperations.addEventListener('click', this.handleOperationsBtnClick.bind(this), false)
  }
}

export default PrettyPreview
