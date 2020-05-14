import React, { useState } from 'react'
import { render } from '@testing-library/react'
import memoDebounce from './memoDebounce'
import wait from './wait'

describe('memoDebounce', () => {
  function getParentComponent(debounceDelay) {
    function Children(props) {
      const { title, count } = props

      return (
        <div>
          <h1>{title}</h1>
          <p>Children count {count}</p>
        </div>
      )
    }

    const ChildrenComponent = memoDebounce(Children, debounceDelay)

    function ParentComponent(props) {
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
          <div>Parent count {count}</div>
          <ChildrenComponent {...props} count={count} />
        </div>
      )
    }

    return ParentComponent
  }

  it("renders component's content without issues", () => {
    const ParentComponent = getParentComponent(500)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')
    getByText('Children count 0')
  })

  it("renders component's updated content with 2s delay", async () => {
    const ParentComponent = getParentComponent(2000)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')
    getByText('Children count 0')

    getByText('Increment count').click()
    getByText('Parent count 1')

    await wait(1000)

    getByText('Children count 0')

    await wait(500)

    getByText('Children count 0')

    await wait(500)

    getByText('Children count 1')
  })
})
