import { connect } from 'react-redux'

import { newDataset, updateDataset, loadDataset, saveDataset, cancelDatasetEdit } from '../actions/dataset'
import { hideModal } from '../actions/app'

import { selectLocalDatasetById, selectDataset } from '../selectors/dataset'

import MetadataEditor from '../components/MetadataEditor'

function mapStateToProps (state, ownProps) {
  const path = ownProps.path
  return Object.assign({
    datasetRef: selectDataset(state, path),
    localDatasetRef: selectLocalDatasetById(state, path)
  }, ownProps)
}

const MetadataEditorContainer = connect(mapStateToProps, {
  newDataset,
  loadDataset,
  updateDataset,
  saveDataset,
  cancelDatasetEdit,
  hideModal
})(MetadataEditor, 'MetadataEditor')

export default MetadataEditorContainer
