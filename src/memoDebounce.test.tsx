import React from 'react'
import { render } from '@testing-library/react'
import memoDebounce from './memoDebounce'

function SimpleComponent(props) {
  const { title, desc } = props
  return (
    <div>
      <h1>{title}</h1>
      <p>{desc}</p>
    </div>
  )
}

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

describe('memoDebounce', () => {
  it("renders component's content without issues", () => {
    const WrappedComponent = memoDebounce(SimpleComponent, 1000)

    const { getByText } = render(
      <WrappedComponent title="Simple title" desc="Simple desc" />
    )

    getByText('Simple title')
    getByText('Simple desc')
  })

  it("renders component's updated content with 2s delay", async () => {
    const WrappedComponent = memoDebounce(SimpleComponent, 2000)

    const { getByText, rerender } = render(
      <WrappedComponent title="Simple title" desc="Simple desc" />
    )

    getByText('Simple title')
    getByText('Simple desc')

    rerender(<WrappedComponent title="Updated title" desc="Updated desc" />)

    await wait(1000)

    getByText('Simple title')
    getByText('Simple desc')

    await wait(1000)

    getByText('Updated title')
    getByText('Updated desc')
  })
})
