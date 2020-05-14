import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import isDeepEqual from './isDeepEqual'

export default function memoDebounce(ComponentToRender, delay = 500) {
  class DebouncedContainer extends Component {
    prevProps = null

    updateDebounced = debounce((nextProps) => {
      const isPropsEqual = isDeepEqual(nextProps, this.prevProps)

      if (isPropsEqual) return

      this.prevProps = nextProps
      this.forceUpdate()
    }, delay)

    shouldComponentUpdate(nextProps) {
      this.updateDebounced(nextProps)
      return false
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
