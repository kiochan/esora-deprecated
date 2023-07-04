import * as packageExports from './index'

describe('core package', () => {
  test('should have a functional component as default export', (done) => {
    expect(typeof packageExports.default).toBe('function')
    done()
  })
})
