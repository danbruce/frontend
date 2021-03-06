import React from 'react'
import PropTypes from 'prop-types'

import { defaultPalette } from '../../propTypes/palette'

import Base from '../Base'

export default class TagItem extends Base {
  template (css) {
    const { tag } = this.props

    return (<div className={css('pill')}>{tag}</div>)
  }

  styles () {
    // want to move tag styling to scss, but for now:
    const palette = defaultPalette
    return {
      pill: {
        // border: '1px solid' + palette.primary,
        borderRadius: 3,
        background: palette.sink,
        margin: '0 0 5px 0',
        padding: '2px 5px',
        display: 'inline-block'
      }
    }
  }
}

TagItem.propTypes = {
  tag: PropTypes.string
  // add in when we move styling to scss
  // color: PropTypes.string
}

TagItem.defaultProps = {
  // color: 'a'
}
