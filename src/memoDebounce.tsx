import React, { Component } from 'react'
import debounce from 'lodash.debounce'
import isDeepEqual from './isDeepEqual'

export type CompareFunction<T> = (
  prevProps: T | undefined,
  nextProps: T
) => boolean

type Options<T> = {
  delay?: number
  isEqualFunction?: CompareFunction<T>
}

export default function memoDebounce<T>(
  ComponentToRender: React.ComponentType<T>,
  options: Options<T>
) {
  const { delay = 500, isEqualFunction = isDeepEqual } = options

  return class DebouncedContainer extends Component<T> {
    prevProps: T | undefined

    updateDebounced = debounce((nextProps) => {
      const isPropsEqual = isEqualFunction(this.prevProps, nextProps)

      if (isPropsEqual) return

      this.savePrevProps()
      this.forceUpdate()
    }, delay)

    savePrevProps = () => {
      this.prevProps = this.props
    }

    shouldComponentUpdate(nextProps: T) {
      this.updateDebounced(nextProps)
      return false
    }

    componentDidMount() {
      this.savePrevProps()
    }

    componentWillUnmount() {
      this.updateDebounced.cancel()
    }

    render() {
      return <ComponentToRender {...this.props} />
    }
  }
}
