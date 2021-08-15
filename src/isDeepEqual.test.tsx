import isDeepEqual from './isDeepEqual'

describe('isDeepEqual', () => {
  it('returns true when two objects are deep equal', () => {
    const firstObj = {
      list: [
        {
          name: 'Aaa'
        }
      ]
    }

    const secondObj = {
      list: [
        {
          name: 'Aaa'
        }
      ]
    }

    expect(isDeepEqual(firstObj, secondObj)).toBe(true)
  })

  it('returns false when two objects are not deep equal', () => {
    const firstObj = {
      list: [
        {
          name: 'Aaa'
        }
      ]
    }

    const secondObj = {
      list: [
        {
          name: 'Aaa',
          other: 'Other'
        }
      ]
    }

    expect(isDeepEqual(firstObj, secondObj)).toBe(false)
  })
})
