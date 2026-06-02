import { testCode } from './testData'

describe('testCode', () => {
  it('keeps suffix entropy when the prefix is multiple characters long', () => {
    const generated = Array.from({ length: 40 }, () => testCode('FAA'))

    expect(new Set(generated).size).toBe(generated.length)
    generated.forEach((value) => {
      expect(value).toMatch(/^FAA[A-Z0-9]+$/)
      expect(value.length).toBeLessThanOrEqual(16)
    })
  })
})
