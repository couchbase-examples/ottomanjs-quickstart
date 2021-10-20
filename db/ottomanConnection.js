import { Ottoman, getOttomanInstances, ValidationError, FindOptions } from 'ottoman'

const ottoman = new Ottoman({
  modelKey: 'type',
  scopeName: '_default',
  collectionName: '_default',
})

module.exports = { ottoman, getOttomanInstances, ValidationError, FindOptions }