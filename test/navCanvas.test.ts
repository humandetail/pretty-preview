import { describe, expect, it } from 'vitest'
import { CLASS_NAME } from '../src/config/constants'
import { State } from '../src/types'
import NavCanvas from '../src/utils/NavCanvas'
import { mockCanvas } from './helper'

describe('NavCanvas', () => {
  mockCanvas()

  const navCanvas = new NavCanvas()
  document.body.appendChild(navCanvas.el)

  const oNavWrapper = document.querySelector<HTMLElement>(`.${CLASS_NAME['nav-canvas-wrapper']}`)
  const oNavBg = document.querySelector<HTMLElement>(`.${CLASS_NAME['nav-canvas-bg']}`)
  const oNavCanvas = document.querySelector<HTMLElement>(`.${CLASS_NAME['nav-canvas']}`)

  it('Should have the right DOM structure.', () => {
    expect(oNavWrapper).toBeInstanceOf(HTMLElement)
    expect(oNavBg).toBeInstanceOf(HTMLElement)
    expect(oNavCanvas).toBeInstanceOf(HTMLElement)
  })

  it('The function `initSize` Should work correctly.', () => {
    const state: State = {
      img: '',
      position: [0, 0],
      scale: 1,
      angle: 0,
      originalSize: [400, 300],
      currentSize: [400, 300],
      viewportSize: [0, 0]
    }

    navCanvas.setState(state)

    let [w, h] = navCanvas.initSize(0)

    expect(w).toEqual(200)
    expect(h).toEqual(150)

    state.originalSize = [300, 400]
    navCanvas.setState(state)

    ;[w, h] = navCanvas.initSize(90)

    expect(w).toEqual(150)
    expect(h).toEqual(200)
  })

  it('The function `handleMousedown` should work correctly.', () => {
    const e = {
      clientX: 100,
      clientY: 200,
      preventDefault: () => {}
    } as unknown as MouseEvent

    navCanvas.handleMousedown(e)

    expect(navCanvas.startPosition).toEqual([100, 200])
  })

  it('The function `handleMousemove` should work correctly.', () => {
    const e = {
      clientX: 100,
      clientY: 200,
      preventDefault: () => {}
    } as unknown as MouseEvent

    navCanvas.handleMousemove(e)

    expect(navCanvas.startPosition).toEqual([100, 200])
  })

  it('The function `handleMouseup` should work correctly.', () => {
    const e = {
      clientX: 100,
      clientY: 200,
      preventDefault: () => {}
    } as unknown as MouseEvent

    navCanvas.handleMouseup(e)

    expect(navCanvas.startPosition).toEqual([100, 200])
  })

  it('The function `setAreaMove` should work correctly.', () => {
    const e = {
      clientX: 100,
      clientY: 200,
      preventDefault: () => {}
    } as unknown as MouseEvent

    navCanvas.setAreaMove(e, true)

    expect(navCanvas.areaPosition).toEqual([60, 60])
  })
})
