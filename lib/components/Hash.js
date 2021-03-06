import React from 'react'
import PropTypes from 'prop-types'

import { defaultPalette } from '../propTypes/palette'

import Base from './Base'

export default class Hash extends Base {
  template (css) {
    const { hash, datasetRef, short, noPrefix, style, old } = this.props
    let displayHash = hash || datasetRef.path
    if (!displayHash || displayHash.length < 52) {
      displayHash = 'invalid hash'
    } else {
      displayHash = displayHash.slice('/ipfs/'.length)
      displayHash = short ? displayHash.slice(0, 2) + '...' + displayHash.slice(-6) : displayHash
    }
    return (
      <div className='hash' style={style} >
        {!noPrefix && <span>/ipfs/</span>}
        {displayHash}
        {old ? <span className={css('old')}>not latest version</span> : undefined}
      </div>
    )
  }

  styles () {
    const palette = defaultPalette
    return {
      old: {
        color: palette.primary,
        fontWeight: 600,
        marginLeft: 20
      }
    }
  }
}

Hash.propTypes = {
  short: PropTypes.bool,
  noPrefix: PropTypes.bool,
  style: PropTypes.object
}

Hash.defaultProps = {
  style: {},
  short: false,
  noPrefix: false,
  datasetRef: {}
}
