import React, { PropTypes } from 'react'

import DatasetRefProps from '../propTypes/datasetRefProps.js'

const DatasetHeader = ({ datasetRef, onDelete, onEditMetadata }) => {
  const { name, path, dataset } = datasetRef

  return (
    <div className='row'>
      <header className='blue page-header col-md-12'>
        <hr className='blue' />
        <span>| </span><a className='green right' download={`${name}.zip`} href={`/download/${path}`}> Download</a>
        { onDelete && <a className='red right' onClick={onDelete}>| Delete&nbsp;</a> }
        <a className='green right' onClick={onEditMetadata}>Edit Metadata&nbsp;</a>
        <h1 className='inline-block'>{ name }</h1>
        { dataset.title ? <h4 className='inline-block dt-string'>{ dataset.title }</h4> : undefined }
        <p className='path dt-string'>{ path }</p>
        { dataset.sourceUrl ? <p><span>| <a href={dataset.sourceUrl} rel='noopener noreferrer' target='_blank'>{ dataset.sourceUrl }</a></span></p> : undefined }
      </header>
    </div>
  )
}

DatasetHeader.propTypes = {
  // dataset data model
  datasetRef: DatasetRefProps,
  onDelete: PropTypes.func,
  onEditMetadata: PropTypes.func
}

DatasetHeader.defaultProps = {
}

export default DatasetHeader