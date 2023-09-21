import { describe, expect, it } from 'vitest'
import { createTemplate, mockCanvas } from './helper'
import PrettyPreview from '../index'
import { CLASS_NAME, PREFIX } from '../config/constants'

describe('PrettyPreview', () => {
  mockCanvas()
  createTemplate(document)

  const pp = new PrettyPreview({
    root: '.wrapper'
  })

  const oImg = document.querySelector('.wrapper > img') as HTMLImageElement
  oImg.click()

  const oContainer = document.querySelector<HTMLElement>(`.${CLASS_NAME.container}`)
  const oMask = oContainer?.querySelector<HTMLElement>(`.${CLASS_NAME.mask}`)
  const oBody = oContainer?.querySelector<HTMLElement>(`.${CLASS_NAME.body}`)
  const oCanvas = oBody?.querySelector<HTMLElement>(`.${CLASS_NAME.canvas}`)
  const oWrapper = oCanvas?.querySelector<HTMLElement>(`.${CLASS_NAME.wrapper}`)
  const oPreviewImg = oWrapper?.querySelector<HTMLElement>(`.${CLASS_NAME.img}`)
  const oCloseBtn = oBody?.querySelector<HTMLElement>(`.${CLASS_NAME['btn-close']}`)
  const oSwitchLeftBtn = oBody?.querySelector<HTMLElement>(`.${CLASS_NAME['btn-switch-left']}`)
  const oSwitchRightBtn = oBody?.querySelector<HTMLElement>(`.${CLASS_NAME['btn-switch-right']}`)
  const oOperations = oBody?.querySelector<HTMLElement>(`.${CLASS_NAME.operations}`)
  const oTurnLeftBtn = oOperations?.querySelector<HTMLElement>(`.${CLASS_NAME['btn-turn-left']}`)
  const oTurnRightBtn = oOperations?.querySelector<HTMLElement>(`.${CLASS_NAME['btn-turn-right']}`)
  const oMinusBtn = oOperations?.querySelector<HTMLElement>(`.${CLASS_NAME['btn-minus']}`)
  const oScalePercent = oOperations?.querySelector<HTMLElement>(`.${CLASS_NAME['scale-percent']}`)
  const oPlusBtn = oOperations?.querySelector<HTMLElement>(`.${CLASS_NAME['btn-plus']}`)
  const oScaleLargeBtn = oOperations?.querySelector<HTMLElement>(`.${CLASS_NAME['btn-scale-to-large']}`)
  const oScaleOriginalBtn = oOperations?.querySelector<HTMLElement>(`.${CLASS_NAME['btn-scale-to-original']}`)

  it('Should have the right DOM structure.', () => {
    expect(oContainer).toBeInstanceOf(HTMLElement)
    expect(oMask).toBeInstanceOf(HTMLElement)
    expect(oBody).toBeInstanceOf(HTMLElement)
    expect(oCanvas).toBeInstanceOf(HTMLElement)
    expect(oWrapper).toBeInstanceOf(HTMLElement)
    expect(oPreviewImg).toBeInstanceOf(HTMLElement)
    expect(oCloseBtn).toBeInstanceOf(HTMLElement)
    expect(oSwitchLeftBtn).toBeInstanceOf(HTMLElement)
    expect(oSwitchRightBtn).toBeInstanceOf(HTMLElement)
    expect(oOperations).toBeInstanceOf(HTMLElement)
    expect(oTurnLeftBtn).toBeInstanceOf(HTMLElement)
    expect(oTurnRightBtn).toBeInstanceOf(HTMLElement)
    expect(oMinusBtn).toBeInstanceOf(HTMLElement)
    expect(oScalePercent).toBeInstanceOf(HTMLElement)
    expect(oPlusBtn).toBeInstanceOf(HTMLElement)
    expect(oScaleLargeBtn).toBeInstanceOf(HTMLElement)
    expect(oScaleOriginalBtn).toBeInstanceOf(HTMLElement)
  })

  it('Should be the first image.', () => {
    expect(oSwitchLeftBtn?.classList.contains(`${CLASS_NAME['btn-switch-disabled']}`))
  })

  it('Should switch to next image when `switch-right-btn` clicked.', () => {
    oSwitchRightBtn?.click()
    expect(pp.idx).toEqual(1)

    oSwitchRightBtn?.click()
    expect(pp.idx).toEqual(2)

    oSwitchRightBtn?.click()
    expect(pp.idx).toEqual(2)

    expect(oSwitchRightBtn?.classList.contains(`${CLASS_NAME['btn-switch-disabled']}`))
  })

  it('Should work correctly when `turn-btn` clicked.', () => {
    oTurnLeftBtn?.click()
    expect(pp.angle).toEqual(-90)
    expect(pp.scalePercent).toEqual(pp.defaultScalePercent)
    oTurnRightBtn?.click()
    expect(pp.angle).toEqual(0)
  })

  it('Should work correctly when `scale-btn` clicked.', () => {
    oScaleLargeBtn?.click()
    expect(pp.scalePercent).toEqual(pp.defaultScalePercent)

    oScaleOriginalBtn?.click()
    expect(pp.scalePercent).toEqual(100)

    const arr = [75, 50, 25, 12, 6, 3]

    arr.forEach(percentage => {
      oMinusBtn?.click()
      expect(pp.scalePercent).toEqual(percentage)
    })

    oMinusBtn?.click()
    expect(pp.scalePercent).toEqual(3)

    arr.reverse().slice(1).forEach(percentage => {
      oPlusBtn?.click()
      expect(pp.scalePercent).toEqual(percentage)
    })

    for (let i = 0; i < 10; i++) {
      oPlusBtn?.click()
      expect(pp.scalePercent).toEqual(75 + (i + 1) * 25)
    }

    oScaleLargeBtn?.click()
    expect(pp.scalePercent).toEqual(pp.defaultScalePercent)

    oScaleOriginalBtn?.click()
    expect(pp.scalePercent).toEqual(100)
  })

  it('Should work correctly when mouse wheel.', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    let e = {
      deltaY: 2,
      preventDefault: () => {},
      stopPropagation: () => {}
    } as WheelEvent

    let scalePercent = pp.scalePercent
    pp.handleMouseWheel(e)
    scalePercent = Number((scalePercent * (e.deltaY > 0 ? 0.9 : 1.1)).toFixed(0))
    expect(pp.scalePercent).toEqual(scalePercent)
    pp.handleMouseWheel(e)
    scalePercent = Number((scalePercent * (e.deltaY > 0 ? 0.9 : 1.1)).toFixed(0))
    expect(pp.scalePercent).toEqual(scalePercent)

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    e = {
      deltaY: -2,
      preventDefault: () => {},
      stopPropagation: () => {}
    } as WheelEvent

    pp.handleMouseWheel(e)
    scalePercent = Number((scalePercent * (e.deltaY > 0 ? 0.9 : 1.1)).toFixed(0))
    expect(pp.scalePercent).toEqual(scalePercent)
    pp.handleMouseWheel(e)
    scalePercent = Number((scalePercent * (e.deltaY > 0 ? 0.9 : 1.1)).toFixed(0))
    expect(pp.scalePercent).toEqual(scalePercent)
  })

  it('Should work correctly when drag.', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    let e = {
      clientX: 0,
      clientY: 0,
      preventDefault: () => {},
      stopPropagation: () => {}
    } as MouseEvent

    pp.handleMouseDown(e)

    expect(pp.wrapperPosition).toEqual([0, 0])

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    e = e = {
      clientX: 10,
      clientY: 10,
      preventDefault: () => {},
      stopPropagation: () => {}
    } as MouseEvent

    pp.handleMousemove(e)

    expect(pp.wrapperPosition).toEqual([10, 10])

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    e = e = {
      clientX: 100,
      clientY: 100,
      preventDefault: () => {},
      stopPropagation: () => {}
    } as MouseEvent

    pp.handleMouseup(e)

    expect(pp.wrapperPosition).toEqual([0, 0])
  })

  it('Shoule work', () => {
    pp.angle = 90
    pp.wrapperPosition = [100, 50]
    expect(pp.currentState.angle).toEqual(90)
    expect(pp.currentState.position).toEqual([100, 50])
    pp.idx = 1
    Promise.resolve().then(() => {
      expect(pp.wrapperPosition).toEqual([0, 0])
      expect(pp.currentState.img).toEqual('https://img-squad-prod.humandetail.com/inner/20220601rQeMejlR.png')
    })

    pp.scalePercent = 50
    pp.imageSize = [100, 100]
    expect(pp.currentImageSize).toEqual([50, 50])
  })

  it('The function `handleImgLoaded` should work', () => {
    const img = new Image()

    img.onload = (e: Event) => {
      pp.handleImgLoaded(e)

      const { viewportSize: [vw, vh] } = pp
      const widthRadio = vw / 100
      const heightRadio = vh / 200
      const radio = widthRadio < heightRadio ? widthRadio : heightRadio
      const scalePercent = Number((radio * 100).toFixed(0))

      expect(pp.imageSize).toEqual([440, 280])
      expect(pp.scalePercent).toEqual(scalePercent)
      expect(pp.defaultScalePercent).toEqual(scalePercent)
    }

    img.src = 'https://img-squad-prod.humandetail.com/cover/20220925QErvmqBy.jpg'
  })

  it('The function `handleSwitchBtnClick` should work.', () => {
    pp.handleSwitchBtnClick('left')()
    expect(pp.idx).toEqual(0)
    pp.handleSwitchBtnClick('right')()
    expect(pp.idx).toEqual(1)
  })

  it('Should remove conatiner when close button clicked.', () => {
    expect(oCloseBtn?.click).toBeTypeOf('function')

    oCloseBtn?.click()

    expect(document.querySelector(`.${CLASS_NAME.container}`)).toBe(null)
  })

  it('Constants', () => {
    expect(CLASS_NAME.img).toEqual(`${PREFIX}img`)
  })
})
