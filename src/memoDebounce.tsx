import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import isDeepEqual from './isDeepEqual'

export default function memoDebounce(
  ComponentToRender: React.ComponentType,
  delay = 500
) {
  class DebouncedContainer extends Component {
    prevProps = null

    updateDebounced = debounce((nextProps) => {
      const isPropsEqual = isDeepEqual(nextProps, this.prevProps)
      if (isPropsEqual) return
      this.forceUpdate()
    }, delay)

    shouldComponentUpdate(nextProps) {
      this.updateDebounced(nextProps)
      return false
    }

    componentDidMount() {
      this.prevProps = this.props
    }

    componentWillUnmount() {
      this.updateDebounced.cancel()
    }

    render() {
      return <ComponentToRender {...this.props} />
    }
  }

  return DebouncedContainer
}
