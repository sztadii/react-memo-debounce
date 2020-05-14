import React, { useState } from 'react'
import { render } from '@testing-library/react'
import memoDebounce from './memoDebounce'
import wait from './wait'

describe('memoDebounce', () => {
  function getParentComponent(debounceDelay, initialRenderCount) {
    let renderCount = { count: initialRenderCount }

    function Children(props) {
      const { title, array } = props

      renderCount.count += 1

      return (
        <div>
          <h1>{title}</h1>
          <p>Children render count {renderCount.count}</p>

          {array.map((e) => (
            <div key={e.name}>{e.name}</div>
          ))}
        </div>
      )
    }

    const ChildrenComponent = memoDebounce(Children, debounceDelay)

    function ParentComponent(props) {
      const arrays = [
        [{ name: 'Name' }, { name: 'Other name' }],
        [{ name: 'Name' }, { name: 'Other name' }]
      ]
      let arrayCount = 0
      const [array, setArrayValue] = useState(arrays[0])
      const [count, setCount] = useState(0)

      return (
        <div>
          <button
            onClick={() => {
              setCount(count + 1)
            }}
          >
            Increment count
          </button>

          <button
            onClick={() => {
              arrayCount += 1
              setArrayValue(arrays[arrayCount])
            }}
          >
            Set new array with same values
          </button>
          <ChildrenComponent {...props} array={array} count={count} />
        </div>
      )
    }

    return {
      ParentComponent
    }
  }

  it("renders component's content without issues", () => {
    const { ParentComponent } = getParentComponent(500, 0)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')
    getByText('Children render count 1')
  })

  it("renders component's updated content with 2s delay", async () => {
    const { ParentComponent } = getParentComponent(1000, 0)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')

    getByText('Increment count').click()

    await wait(500)

    getByText('Children render count 1')

    await wait(250)

    getByText('Children render count 1')

    await wait(250)

    getByText('Children render count 2')
  })

  it('will not render if updated parent props have same values', async () => {
    const { ParentComponent } = getParentComponent(1000, 0)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')

    getByText('Set new array with same values').click()

    await wait(500)

    getByText('Children render count 1')

    await wait(250)

    getByText('Children render count 1')

    await wait(250)

    getByText('Children render count 1')
  })
})
