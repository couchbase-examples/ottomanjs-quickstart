import {
  Ottoman,
  getOttomanInstances,
  getDefaultInstance,
  ValidationError,
  FindOptions,
  SearchConsistency,
  Query,
} from 'ottoman'

const ottoman = new Ottoman({
  modelKey: 'type',
  scopeName: 'inventory',
})

module.exports = {
  ottoman,
  getOttomanInstances,
  getDefaultInstance,
  ValidationError,
  FindOptions,
  SearchConsistency,
  Query,
}
