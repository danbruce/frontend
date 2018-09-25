/* globals alert */
import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router'

import Results from './Results'
import EditMeta from './EditMeta'
import EditTransform from './EditTransform'
import EditViz from './EditViz'
import Overview from './Overview'
import NavLinks from '../NavLinks'

import Base from '../Base'
import Dropdown from '../Dropdown'
import DropdownMenu from '../DropdownMenu'

const RunOpts = [
  'Dry Run',
  'Run & Save'
]

export default class Editor extends Base {
  constructor (props) {
    super(props)

    this.state = {
      runOpt: RunOpts[0],
      resultTab: 'local',
      results: undefined,
      datasetError: '',
      datasetMessage: ''
    };

    [
      'onChooseRunOpt',
      'onRun',
      'onDryRun',
      'onRunAndSave'
    ].forEach((m) => { this[m] = this[m].bind(this) })
  }

  componentWillMount () {
    if (!this.props.localDataset) {
      this.props.newDataset({ peername: 'me', name: 'new', path: 'new' })
    }
  }

  onChooseRunOpt (runOpt) {
    this.setState({ runOpt })
  }

  onRun () {
    this.setState({ datasetError: '', datasetMessage: '', results: undefined })

    switch (this.state.runOpt) {
      case RunOpts[0]:
        this.onDryRun()
        break
      case RunOpts[1]:
        this.onRunAndSave()
        break
    }
  }

  onDryRun () {
    const { localDataset } = this.props
    // name, file, body, viz, transform, url
    this.props.dryRunDataset('test', localDataset).then((action) => {
      let results
      if (action.response && action.response.result && action.response.result.meta) {
        if (action.response.entities && action.response.entities.datasetDryRuns) {
          results = action.response.entities.datasetDryRuns[Object.keys(action.response.entities.datasetDryRuns)[0]]
        }
        this.setState({ datasetMessage: action.response.result.meta.message, results })
      }
    }).catch((err) => {
      this.setState({ datasetError: err })
    })
  }

  onRunAndSave () {
    // TODO - !
    alert('saving datasets is not yet implemented, coming very soon!')
  }

  sections () {
    return [
      { name: 'overview', link: '' },
      { name: 'meta', link: 'meta' },
      { name: 'transform', link: 'transform' },
      { name: 'viz', link: 'viz' }
    ]
  }

  template (css) {
    const { runOpt, resultTab, datasetError, datasetMessage, results } = this.state
    const { match, localDataset, updateDataset } = this.props

    return (
      <div className={`${css('wrap')} editor`}>

        <section className={css('switcher')}>
          <div className={css('sections')}>
            <NavLinks url={match.path} linkList={this.sections()} />
          </div>
          <div className={css('actions')}>
            <div style={{ float: 'right', margin: 10 }}>
              <Dropdown text={runOpt} onClick={this.onRun} color='c' name='run' dropdown={DropdownMenu} options={RunOpts} onChooseOption={this.onChooseRunOpt} />
            </div>
          </div>
        </section>

        <div className={css('contents')}>
          <div className={css('switch')} >
            <Switch>
              <Route
                path={`${match.path}/meta`}
                render={props => (
                  <EditMeta
                    meta={localDataset.meta}
                    onChange={(meta) => {
                      updateDataset(Object.assign({ path: 'new' }, localDataset, { meta }))
                    }}
                  />
                )}
              />
              <Route
                path={`${match.path}/transform`}
                render={props => (
                  <EditTransform
                    transform={localDataset.transform}
                    onChange={(transform) => {
                      updateDataset(Object.assign({ path: 'new' }, localDataset, { transform }))
                    }}
                  />
                )}
              />
              <Route
                path={`${match.path}/viz`}
                render={props => (
                  <EditViz
                    viz={localDataset.viz}
                    onChange={(viz) => {
                      updateDataset(Object.assign({ path: 'new' }, localDataset, { viz }))
                    }}
                  />
                )}
              />
              <Route
                path={`${match.path}`}
                render={props => (
                  <Overview
                    localDataset={localDataset}
                    onChangeName={(name) => {
                      updateDataset(Object.assign({ path: 'new' }, localDataset, { name }))
                    }}
                  />
                )}
              />
            </Switch>
          </div>
          <div className={css('results')}>
            <Results
              currentTab={resultTab}
              resultDataset={results}
              message={datasetMessage}
              error={datasetError}
            />
          </div>
        </div>
      </div>
    )
  }

  styles () {
    return {
      wrap: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      },
      header: {
        flex: '1 1 90px'
      },
      switcher: {
        flex: '1 1 40px',
        background: '#262626',
        display: 'flex'
      },
      sections: {
        padding: '15px 10px',
        flex: '1 1 50%'
      },
      actions: {
        flex: '1 1 50%'
      },
      contents: {
        flex: '2 2 90%',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        background: '#1e1e1e'
      },
      switch: {
        overflow: 'hidden',
        flex: '2 1 60%'
      },
      results: {
        flex: '1 1 40%',
        overflow: 'auto'
      }
    }
  }
}

Editor.propTypes = {
  // TODO - make dataset prop types
  resultDataset: PropTypes.object,
  localDataset: PropTypes.object,

  initDataset: PropTypes.func.isRequired,
  dryRunDataset: PropTypes.func.isRequired,
  newDataset: PropTypes.func.isRequired,
  updateDataset: PropTypes.func.isRequired,
  cancelDatasetEdit: PropTypes.func.isRequired
}

Editor.defaultProps = {
  localDataset: {}
}