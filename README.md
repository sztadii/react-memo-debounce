# react-memo-debounce

## Description:

A function to prevent additional re-rendering, same as React.memo, but with debounce.

## How to install
```
npm install react-memo-debounce
```

## Example

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

// 1000ms delay
export default memoDebounce(SimpleComponent, 1000)
```
