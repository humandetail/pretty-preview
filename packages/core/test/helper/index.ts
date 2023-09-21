export const createTemplate = (doc: Document): void => {
  const app = doc.createElement('div')

  app.id = 'app'

  app.innerHTML = `
    <div class="wrapper">
      <img src="https://img-squad-prod.humandetail.com/cover/20220925QErvmqBy.jpg" alt="">
      <img src="https://img-squad-prod.humandetail.com/inner/20220601rQeMejlR.png" alt="">
      <img src="https://img-squad-prod.humandetail.com/cover/20220808an1p7Wd9.jpg" alt="">
    </div>
  `

  doc.body.appendChild(app)
}

export const mockCanvas = (): void => {
  const createElement = document.createElement.bind(document)

  // eslint-disable-next-line no-undef
  document.createElement = <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions | undefined): HTMLElementTagNameMap[K] => {
    const oElem = createElement(tagName, options)
    // Provide getContext() to unit test.
    if (tagName === 'canvas') {
      if (!(oElem as HTMLCanvasElement).getContext) {
        (oElem as any).getContext = (contextId: string) => {
          return {
            contextId,
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            globalCompositeOperation: '',
            fillRect: () => '',
            save: () => '',
            translate: () => '',
            strokeRect: () => '',
            restore: () => '',
            clearRect: () => ''

          } as unknown as CanvasRenderingContext2D
        }
        return oElem
      }
    }
    return oElem
  }
}
