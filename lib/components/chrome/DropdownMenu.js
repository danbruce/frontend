import React from 'react'
import PropTypes from 'prop-types'

import Base from '../Base'

export default class DropdownMenu extends Base {
  template (css) {
    const { display, options, onChooseOption } = this.props
    return (
      <div className={`dropdown-menu ${display ? css('block') : ''}`}>
        {options.map((opt, i) => {
          return <a key={i} className='dropdown-item' onClick={onChooseOption.bind(this, opt)} >{opt}</a>
        })}
      </div>
    )
  }

  styles () {
    return {
      block: {
        display: 'block'
      }
    }
  }
}

DropdownMenu.propTypes = {
  options: PropTypes.array,
  onChooseOption: PropTypes.func,
  display: PropTypes.bool.isRequired
}

DropdownMenu.defaultProps = {
  options: ['Action', 'Another Action', 'Something else here'],
  onChooseOption: (opt) => { console.log('chose option:', opt) }
}
