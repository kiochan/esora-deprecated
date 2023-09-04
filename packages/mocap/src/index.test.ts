import * as packageExports from './index'

describe('@esora/mocap package', () => {
  test('should have a default export', (done) => {
    expect(typeof packageExports.default).toBe('object')
    done()
  })
})
