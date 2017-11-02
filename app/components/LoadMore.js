import React, { PropTypes } from 'react'

import Base from './Base'
import Spinner from './Spinner'

export default class LoadMore extends Base {
  constructor (props) {
    super(props);
    [
      'renderLoadMore',
      'renderEnd'
    ].forEach((m) => this[m] = this[m].bind(this))
  }

  renderLoadMore (css, onClick) {
    return (
      <button className={`${css('button')}`} onClick={onClick}><label className={css('label')}>load more</label></button>
    )
  }

  renderEnd (css, type) {
    return (
      <div className={css('end')} />
    )
  }

  template (css) {
    const { fetchedAll, onClick, type, loading } = this.props
    if (loading) {
      <Spinner />
    }
    return (
      <div className={css('wrap')}>
        { fetchedAll ? this.renderEnd(css, type) : this.renderLoadMore(css, onClick) }
      </div>
    )
  }

  styles () {
    return {
      wrap: {
        width: '100%'
      },
      button: {
        display: 'black',
        backgroundColor: 'transparent',
        boarderColor: 'transparent',
        lineHeight: '1.25',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        'font-weight': 'normal',
        'line-height': '1.25',
        'text-align': 'center',
        'white-space': 'nowrap',
        'vertical-align': 'middle',
        'cursor': 'pointer',
        'user-select': 'none',
        'border': '0.5px solid transparent',
        'padding': '0.5rem 1rem',
        'font-size': '1rem',
        'border-radius': '0.25rem',
        ':hover': {
          backgroundColor: '#000000'
        }
      },
      label: {
        margin: 0,
        color: '#50C9F4'
      },
      'button:hover': {
        backgroundColor: 'pink'
      },
      end: {
        height: '80px'
      }
    }
  }
}

LoadMore.propTypes = {
  loading: PropTypes.bool.isRequired,
  fetchedAll: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}