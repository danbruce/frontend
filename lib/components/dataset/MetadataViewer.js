import React from 'react'
import PropTypes from 'prop-types'

import { defaultPalette } from '../../propTypes/palette'

import Base from '../Base'
import Json from '../Json'

export default class MetadataViewer extends Base {
  constructor (props) {
    super(props)

    this.stdFields = [
      'title',
      'theme',
      'keywords',
      'description',
      'license',
      'accessPath',
      'language',
      'citations',
      'contributors',
      'accrualPeriodicity',
      'downloadPath',
      'homePath',
      'identifier',
      'readmePath',
      'version'
    ]

    this.ignoreFields = ['qri', 'path'];

    ['renderTable', 'renderValue'].forEach((m) => { this[m] = this[m].bind(this) })
  }

  renderTable (css, keys, data) {
    return (
      <div className={css('tableWrap')}>
        <table className={css('table')}>
          <tbody>
            {keys.map((key) => {
              return (
                <tr key={key} className={css('row')}>
                  <td className={css('key')} valign='top'>{key}</td>
                  <td className={css('value')}>{this.renderValue(data[key])}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  renderValue (value) {
    switch (typeof value) {
      case 'string':
      case 'number':
        return <span>{value}</span>
      case 'object':
      case 'array':
        return <Json body={value} />
      default:
        return <span>{JSON.stringify(value)}</span>
    }
  }

  template (css) {
    const { metadata, stdOnly } = this.props

    const std = this.stdFields.filter((key) => !!metadata[key])
    const extra = Object.keys(metadata).filter((key) => {
      return !(~this.stdFields.findIndex((sKey) => (key === sKey)) || ~this.ignoreFields.findIndex((iKey) => (key === iKey)))
    })

    return (
      <div className={css('wrap')}>
        <h5 className={css('title')}>Standard Metadata</h5>
        {this.renderTable(css, std, metadata)}

        {!stdOnly && (extra.length > 0) && <div>
          <h5 className={css('title')}>Additional Metadata</h5>
          {this.renderTable(css, extra, metadata)}
        </div>}
      </div>
    )
  }

  styles () {
    const palette = defaultPalette
    return {
      wrap: {
        padding: 20
      },
      title: {
        marginTop: 30
      },
      tableWrap: {
        width: '100%',
        marginTop: 10,
        borderRadius: 3,
        border: '1px solid #eee',
        overflow: 'hidden'
      },
      table: {
        width: '100%'
      },
      row: {
        borderBottom: '1px solid #eee'
      },
      key: {
        padding: '8px 5px'
      },
      link: {
        fontSize: 17
      },
      info: {
        color: palette.primaryLight
      },
      date: {
        textAlign: 'right',
        color: palette.primaryLight,
        paddingRight: 15
      }
    }
  }
}

MetadataViewer.propTypes = {
  metadata: PropTypes.object.isRequired,
  stdOnly: PropTypes.bool
}

MetadataViewer.defaultProps = {
  metadata: {},
  stdOnly: false
}
