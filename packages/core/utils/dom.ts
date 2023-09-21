import Icons from '../config/icons'

export const createElement = <T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  attrs: Record<string, any> = {},
  cssText: string = '',
  innerHTML: string = ''
): HTMLElementTagNameMap[T] => {
  const oElem = document.createElement(tagName)

  Object.entries(attrs).forEach(([key, value]) => {
    oElem.setAttribute(key, value)
  })

  if (cssText) {
    oElem.style.cssText = cssText
  }

  if (innerHTML) {
    oElem.innerHTML = innerHTML
  }

  return oElem
}

export const createBtn = (
  icon: keyof typeof Icons,
  attrs: Record<string, any> = {},
  cssText: string = ''
): HTMLDivElement => {
  return createElement('div', attrs, cssText, Icons[icon])
}
