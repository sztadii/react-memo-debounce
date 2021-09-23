# react-memo-debounce

## Description:

A function to prevent unnecessary render calls. <br />
Almost like `React.memo`, but by default we will deeply compare values with debounce effect. <br />
So we will avoid many unnecessary render calls. <br />
It can be useful when each render operation is doing some expensive calculation. <br />

## How to install
```
npm install react-memo-debounce
```

## Examples

Here we will wait 1000ms and compare props values by our isDeepEqual function
```
Import React from 'react'
import memoDebounce from 'react-memo-debounce'

function SimpleComponent(props) {
  const { title, description } = props
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

export default memoDebounce(SimpleComponent, { delay: 1_000 })
```

Here we will wait 500ms and compare props by own function
```
Import React from 'react'
import memoDebounce from 'react-memo-debounce'

function SimpleComponent(props) {
  const { title, description } = props
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

const isEqual = (prevProps, nextProps) => prevProps.title === nextProps.title
export default memoDebounce(SimpleComponent, { delay: 500, isEqualFunction: isEqual })
```
