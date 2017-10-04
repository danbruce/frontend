import { selectQueryById } from './query'

const usersDatasetsSection = 'popularDatasets'
const usersDatasetsNode = 'popularDatasets'

export function addressPath (address) {
  return '/' + address.replace(/\./gi, '/')
}

export function selectDataset (state, id) {
  return state.entities.datasets[id]
}

export function selectDatasetByPath (state, path) {
  return state.entities.datasets[path]
}

export function selectUserDatasets (state, username) {
  const { datasets } = state.entities
  return Object.keys(datasets).reduce((sets, id) => {
    const ds = datasets[id]
    if (ds.address.split('.')[0] === username) {
      sets.push(ds)
    }
    return sets
  }, [])
}

export function selectDatasetByAddress (state, address) {
  const { datasets } = state.entities
  const id = Object.keys(datasets).find(id => (datasets[id].address === address))
  if (!id) { return undefined }
  if (datasets[id].default_query) {
    return Object.assign({},
      datasets[id],
      { default_query: selectQueryById(state, datasets[id].default_query) })
  } else {
    return datasets[id]
  }
}

export function selectDatasetByQueryString (state, queryString) {
  const { datasets } = state.entities
  // if (datasets[id].default_query) {
  //   return Object.assign({},
  //     datasets[id],
  //     { default_query : selectQueryById(state, datasets[id].default_query) });
  // } else {
  //   return datasets[id]
  // }
  const path = Object.keys(datasets).find(path => {
    console.log(datasets[path].dataset.queryString, queryString)
    return datasets[path].dataset.queryString === queryString
  })
  // if (!path) { return undefined; }
  return datasets[path]
}

export function selectDatasetData (state, path) {
  const data = state.entities.data[path]
  return data ? data.data : undefined
}

export function selectDatasetReadme (state, address) {
  return state.entities.readmes[address]
}

export function selectDatasetDescendants (state, address) {
  const { datasets } = state.entities
  return Object.keys(datasets).filter((adr) => adr.includes(address) && adr !== address).map(adr => { return datasets[adr] })
}

export function selectLocalDatasetByAddress (state, address) {
  const { datasets } = state.locals
  const id = Object.keys(datasets).find(id => (datasets[id].address === address))
  return id ? datasets[id] : undefined
}

export function selectLocalDatasetById (state, id) {
  return state.locals.datasets[id]
}

export function selectDatasetChanges (state, datasetId) {
  const { changes } = state.entities
  return changes.filter(change => (change.datasetId === datasetId))
}

export function selectAllDatasets (state) {
  const { datasets } = state.entities
  return Object.keys(datasets).map(id => datasets[id]).sort((a, b) => {
    return (a.address === b.address) ? 0 : ((a.address < a.address)) ? -1 : 1
  })
}

// generate an object-of-objects that maps the address space without overlaps
export function selectDatasetTree (state) {
  const { datasets } = state.entities
  return Object.keys(datasets).reduce((acc, adr, i) => {
    adr.split('.').reduce((acc, el) => {
      acc[el] || (acc[el] = { })
      return acc[el]
    }, acc)

    return acc
  }, {})
}

export function treeNodes (tree) {
  function walk (acc, obj, address) {
    return Object.keys(obj).reduce((acc, key) => {
      const adr = address ? address + '.' + key : key
      acc.push({ id: key, radius: 10, address: adr })
      return walk(acc, obj[key], adr)
    }, acc)
  }

  return walk([], tree, '')
}

export function treeConnections (tree) {
  function walk (acc, parent, obj) {
    return Object.keys(obj).reduce((acc, child) => {
      acc.push({ source: parent, target: child })
      return walk(acc, child, obj[child])
    }, acc)
  }

  return Object.keys(tree).reduce((acc, node) => {
    return walk(acc, node, tree[node])
  }, [])
}

export function selectDatasetSearchString (state) {
  return state.app.search.dataset ? state.app.search.dataset : ''
}

export function selectDatasets (state, section, node) {
  if (!section && !node) {
    section = usersDatasetsSection
    node = usersDatasetsNode
  }
  const { datasets } = state.entities
  return selectDatasetsIds(state, section, node).map(id => datasets[id])
}

export function selectDatasetsIsFetching (state, section, node) {
  if (!section && !node) {
    section = usersDatasetsSection
    node = usersDatasetsNode
  }
  return (state.pagination[section] && state.pagination[section][node]) ? state.pagination[section][node].isFetching : false
}

export function selectDatasetsPageCount (state, section, node) {
  if (!section && !node) {
    section = usersDatasetsSection
    node = usersDatasetsNode
  }
  return (state.pagination[section] && state.pagination[section][node]) ? state.pagination[section][node].pageCount : 0
}

export function selectDatasetsFetchedAll (state, section, node) {
  if (!section && !node) {
    section = usersDatasetsSection
    node = usersDatasetsNode
  }
  return (state.pagination[section] && state.pagination[section][node]) ? state.pagination[section][node].fetchedAll : false
}

export function selectDatasetsIds (state, section, node) {
  if (!section && !node) {
    section = usersDatasetsSection
    node = usersDatasetsNode
  }
  return (state.pagination[section] && state.pagination[section][node]) ? state.pagination[section][node].ids : []
}

export function selectNoDatasets (state, section, node) {
  if (!section && !node) {
    section = usersDatasetsSection
    node = usersDatasetsNode
  }
  return (state.pagination[section] && state.pagination[section][node] && selectDatasetsPageCount(state, section, node) === 1 && selectDatasetsFetchedAll === true)
}

// Older version
// export function selectNoDatasets (state) {
//   const { pagination } = state
//   const { popularDatasets } = pagination
//   return (popularDatasets && popularDatasets.popularDatasets && popularDatasets.pageCount == 1 && popularDatasets.fetchedAll == true)
// }
