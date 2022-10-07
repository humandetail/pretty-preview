import { describe, expect, it } from 'vitest'
import { PrettyPreview } from '../packages'

describe('PrettyPreview', () => {
  const pp = new PrettyPreview()
  it('Test', () => {
    expect(pp.a === 1, 'pp.a is 1')
  })
})
