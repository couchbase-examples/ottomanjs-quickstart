import { Ottoman, ValidationError } from 'ottoman';

const ottoman = new Ottoman({
  modelKey: 'type',
  scopeName: '_default',
  collectionName: '_default',
});

module.exports = { ottoman, ValidationError };