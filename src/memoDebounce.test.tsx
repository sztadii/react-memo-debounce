import React, { useState } from 'react'
import { render } from '@testing-library/react'
import memoDebounce from './memoDebounce'

function wait(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

function getInitialElements(
  debounceDelay: number,
  initialRenderCount: number,
  comparePropsFunction?: any
) {
  let childrenRenderCount = initialRenderCount
  let parentActiveArrayIndex = 0

  function Children(props: {
    title: string
    activeArray: any[]
    prentRenderCount: number
  }) {
    const { title, activeArray, prentRenderCount } = props

    childrenRenderCount += 1

    return (
      <div>
        <h1>{title}</h1>
        <p>In children childrenRenderCount value {childrenRenderCount}</p>
        <p>In children prentRenderCount value {prentRenderCount}</p>

        {activeArray.map((e) => (
          <div key={e.name}>{e.name}</div>
        ))}
      </div>
    )
  }

  const ChildrenComponent = memoDebounce(
    Children,
    debounceDelay,
    comparePropsFunction
  )

  function ParentComponent(props: { title: string }) {
    const arrays = [
      [{ name: 'First name' }, { name: 'First title' }],
      [{ name: 'Second name' }, { name: 'Second title' }]
    ]
    const [activeArray, setActiveArray] = useState(arrays[0])
    const [parentRenderCount, setParentRenderCount] = useState(0)

    return (
      <div>
        <button
          onClick={() => {
            setParentRenderCount(parentRenderCount + 1)
          }}
        >
          Increment parentRenderCount
        </button>

        <button
          onClick={() => {
            parentActiveArrayIndex = parentActiveArrayIndex === 0 ? 1 : 0
            setActiveArray(arrays[parentActiveArrayIndex])
          }}
        >
          Toggle parent array value
        </button>

        <p>In parent parentRenderCount {parentRenderCount}</p>

        <ChildrenComponent
          {...props}
          activeArray={activeArray}
          prentRenderCount={parentRenderCount}
        />
      </div>
    )
  }

  return {
    ParentComponent
  }
}

describe('memoDebounce', () => {
  it("render the component's content without any issues", () => {
    const { ParentComponent } = getInitialElements(500, 0)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')
    getByText('In children childrenRenderCount value 1')
  })

  it("render the component's updated content with some delay", async () => {
    const { ParentComponent } = getInitialElements(1000, 0)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')

    getByText('Increment parentRenderCount').click()

    await wait(500)

    getByText('In children childrenRenderCount value 1')

    await wait(500)

    getByText('In children childrenRenderCount value 2')
  })

  it('will not render if updated parent props have the same value', async () => {
    const { ParentComponent } = getInitialElements(1000, 0)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')

    getByText('Toggle parent array value').click()

    await wait(500)

    getByText('In children childrenRenderCount value 1')

    // Back to the first value of the array
    getByText('Toggle parent array value').click()

    await wait(1100)

    getByText('In children childrenRenderCount value 1')
  })

  it("when each time parent's props change the deep value then children render the update value", async () => {
    const { ParentComponent } = getInitialElements(1000, 0)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')

    getByText('Toggle parent array value').click()
    await wait(1000)
    getByText('In children childrenRenderCount value 2')

    getByText('Toggle parent array value').click()
    await wait(1000)
    getByText('In children childrenRenderCount value 3')
  })

  it('when multi times parent component was updating then children will render only last time', async () => {
    const { ParentComponent } = getInitialElements(1000, 0)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')

    getByText('Increment parentRenderCount').click()
    getByText('In parent parentRenderCount 1')

    await wait(500)
    getByText('In children prentRenderCount value 0')

    getByText('Increment parentRenderCount').click()
    getByText('In parent parentRenderCount 2')

    await wait(500)
    getByText('In children prentRenderCount value 0')

    getByText('Increment parentRenderCount').click()
    getByText('In parent parentRenderCount 3')

    await wait(500)
    getByText('In children prentRenderCount value 0')

    getByText('Increment parentRenderCount').click()
    getByText('In parent parentRenderCount 4')

    await wait(500)
    getByText('In children prentRenderCount value 0')

    await wait(500)
    getByText('In children prentRenderCount value 4')
    getByText('In parent parentRenderCount 4')
  })

  it('when isEqualFunction return true then children component never re-render', async () => {
    const isEqualFunction = () => {
      return true
    }

    const { ParentComponent } = getInitialElements(400, 0, isEqualFunction)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')

    getByText('Increment parentRenderCount').click()

    await wait(500)
    getByText('In children childrenRenderCount value 1')

    getByText('Increment parentRenderCount').click()

    await wait(500)
    getByText('In children childrenRenderCount value 1')
  })

  it('when isEqualFunction return false then children component always re-render', async () => {
    const isEqualFunction = () => {
      return false
    }

    const { ParentComponent } = getInitialElements(400, 0, isEqualFunction)
    const { getByText } = render(<ParentComponent title="Simple title" />)

    getByText('Simple title')

    getByText('Increment parentRenderCount').click()

    await wait(500)
    getByText('In children childrenRenderCount value 2')

    getByText('Increment parentRenderCount').click()

    await wait(500)
    getByText('In children childrenRenderCount value 3')
  })
})
