import isDeepEqual from './isDeepEqual'

describe('isDeepEqual', () => {
  it('return true when two objects are deep equal', () => {
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

  it('return false when two objects are not deep equal', () => {
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
