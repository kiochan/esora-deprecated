import * as core from './index'

describe('core package', () => {
  test('should have a default export', (done) => {
    expect(typeof core.default).toBe('object')
    done()
  })
})
