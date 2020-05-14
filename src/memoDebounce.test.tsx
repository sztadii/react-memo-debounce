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

test('WrappedComponent render its content', async () => {
  const WrappedComponent = memoDebounce(SimpleComponent)

  const { getByText } = render(
    <WrappedComponent title="Simple title" desc="Simpel desc" />
  )

  getByText('Simple title')
})
