import React from 'react'
import Base from './Base'
import Spinner from './Spinner'

export default class AppLoading extends Base {
  template (css) {
    return (
      <div className={css('page')}>
        <div className={css('center')}>
          <h4>Starting qri (aka "query")</h4>
          <p>Have a wonderful day!</p>
          <Spinner />
        </div>
      </div>
    )
  }
  styles () {
    return {
      'page': {
        background: '#0e2630',
        position: 'absolute',
        width: '100%',
        height: '100%',
        minHeight: 1000,
        top: 0,
        left: 0
      },
      'center': {
        width: 300,
        height: 300,
        margin: '10em auto',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        textAlign: 'center'
      }
    }
  }
}