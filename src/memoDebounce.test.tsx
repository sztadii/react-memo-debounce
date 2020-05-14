import React from 'react'
import { render } from '@testing-library/react'
import memoDebounce from './memoDebounce'
import wait from './wait'

describe('memoDebounce', () => {
  let renderCount = 0

  function SimpleComponent(props) {
    const { title, desc } = props

    renderCount += 1

    return (
      <div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
    )
  }

  afterEach(() => {
    renderCount = 0
  })

  it("renders component's content without issues", () => {
    const WrappedComponent = memoDebounce(SimpleComponent, 500)

    const { getByText } = render(
      <WrappedComponent title="Simple title" desc="Simple desc" />
    )

    getByText('Simple title')
    getByText('Simple desc')
  })

  it("renders component's updated content with 2s delay", async () => {
    const WrappedComponent = memoDebounce(SimpleComponent, 1000)

    const { getByText, rerender } = render(
      <WrappedComponent title="Simple title" desc="Simple desc" />
    )

    getByText('Simple title')
    getByText('Simple desc')

    expect(renderCount).toBe(1)

    rerender(<WrappedComponent title="Updated title" desc="Updated desc" />)

    await wait(500)

    getByText('Simple title')
    getByText('Simple desc')

    await wait(500)

    getByText('Updated title')
    getByText('Updated desc')

    expect(renderCount).toBe(2)
  })
})
