import React from 'react'
import PropTypes from 'prop-types'
import MonacoEditor from 'react-monaco-editor'
import { isEmpty } from '../../utils/reflect'

import { defaultPalette } from '../../propTypes/palette'

import Base from '../Base'
import Button from '../chrome/Button'
import KeyValueInput from '../form/KeyValueInput'

const blankTransform = {
  syntax: 'skylark'
}

const starter = [
  'load("http.star", "http")',
  '',
  'def download(ctx):',
  '  print("download here")',
  '  # res = http.get("http://location-of-dataset.com/data.json")',
  '  # return res.json()',
  '',
  'def transform(ds, ctx):',
  '  # to get the downloaded content:',
  '  # data = ctx.download',
  '  #',
  '  print("hello Qri! \\n")',
  '  ds.set_body(["this","is","dataset","data"])'
].join('\n')

export default class TransformEditor extends Base {
  constructor (props) {
    super(props)

    this.state = {
      panel: 'edit'
    };

    [
      'editorDidMount',
      'onConfigChange',
      'onSecretsChange',
      'onAddTransform',
      'onRemoveTransform',
      'panelSetter',
      'panelActive'
    ].forEach((m) => { this[m] = this[m].bind(this) })
  }

  // editor = null

  editorDidMount (editor, monaco) {
    // this.editor = editor
    editor.focus()
    editor.layout()
  }

  onConfigChange (_, config) {
    const { transform } = this.props
    this.props.onChangeTransform(Object.assign({}, transform, { config }))
  }

  onSecretsChange (_, secrets) {
    const { transform } = this.props
    this.props.onChangeTransform(Object.assign({}, transform, { secrets }))
  }

  panelSetter (panel) {
    return () => {
      this.setState({ panel })
    }
  }

  panelActive (panel) {
    return this.state.panel === panel
  }

  onAddTransform () {
    this.props.onChangeTransform(blankTransform)
    this.props.onChangeScript(starter)
  }

  onRemoveTransform () {
    this.props.onRemove('transform')
    this.props.onChangeScript(undefined)
  }

  template (css) {
    const { panel } = this.state
    const { transform, script, onChangeScript, layout } = this.props

    const options = {
      selectOnLineNumbers: true
    }

    if (isEmpty(transform)) {
      return (
        <div className={css('wrap')}>
          <div className={css('center')}>
            <Button onClick={this.onAddTransform} color='b' text='Add Transform Script' />
          </div>
        </div>
      )
    }

    return (
      <div className={css('wrap')}>
        <header className={css('header')} >
          <div className={css('panels')}>
            <a className={css('panelItem', this.panelActive('edit') && 'active')} onClick={this.panelSetter('edit')} >Edit</a>
            <a className={css('panelItem', this.panelActive('config') && 'active')} onClick={this.panelSetter('config')} >Config</a>
            <a className={css('panelItem', this.panelActive('secrets') && 'active')} onClick={this.panelSetter('secrets')} >Secrets</a>
          </div>
          <div>
            <Button onClick={this.onRemoveTransform} color='b' text='Remove' />
          </div>
        </header>
        <div className={css('content')}>
          {panel === 'edit' &&
            <MonacoEditor
              language='python'
              theme='vs-dark'
              value={script || '\n\n'}
              options={options}
              onChange={onChangeScript}
              editorDidMount={this.editorDidMount}
              height={layout.height - 100}
            />}

          {panel === 'config' &&
            <div className={css('config')}>
              <h3 className='white' >Config</h3>
              <KeyValueInput
                name='config'
                value={transform.config}
                onChange={this.onConfigChange}
              />
            </div>}

          {panel === 'secrets' &&
            <div className={css('config')}>
              <h3 className='white' >Secrets</h3>
              <KeyValueInput
                name='secrets'
                value={transform.secrets}
                onChange={this.onSecretsChange}
              />
            </div>}
        </div>
      </div>
    )
  }

  styles () {
    return {
      wrap: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      },
      config: {
        padding: 20
      },
      center: {
        width: 200,
        margin: '150px auto'
      },
      panels: {
        margin: '5px 0 5px 10px'
      },
      panelItem: {
        marginRight: 10,
        fontWeight: 'normal',
        color: defaultPalette.neutralMuted
      },
      active: {
        // fontWeight: 'bold',
        color: defaultPalette.a
      },
      header: {
        padding: '10px 4px 2px 10px',
        flex: '1 1 40px',
        display: 'flex',
        justifyContent: 'space-between'
      },
      content: {
        flex: '2 1 100%',
        marginTop: 10,
        height: '100%'
      }
    }
  }
}

TransformEditor.propTypes = {
  transform: PropTypes.object,
  onChangeTransform: PropTypes.func.isRequired,
  script: PropTypes.string,
  onChangeScript: PropTypes.func.isRequired
}

TransformEditor.defaultProps = {
  transform: {}
}
