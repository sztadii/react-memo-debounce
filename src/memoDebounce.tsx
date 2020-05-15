import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import isDeepEqual from './isDeepEqual'

export default function memoDebounce<T>(
  ComponentToRender: React.ComponentType<T>,
  delay = 500
) {
  return class DebouncedContainer extends Component<T> {
    prevProps: T | undefined

    updateDebounced = debounce((nextProps) => {
      const isPropsEqual = isDeepEqual(nextProps, this.prevProps)
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
