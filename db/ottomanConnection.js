import { Ottoman, getOttomanInstances, getDefaultInstance, ValidationError, FindOptions, SearchConsistency } from 'ottoman'

const ottoman = new Ottoman({
  modelKey: 'type',
  scopeName: '_default',
  collectionName: '_default',
})

module.exports = { ottoman, getOttomanInstances, getDefaultInstance, ValidationError, FindOptions, SearchConsistency }