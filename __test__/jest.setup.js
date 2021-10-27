import { getOttomanInstances, getDefaultInstance, Ottoman } from './imports'
import { bucketName, connectionString, password, username } from './testData';

beforeEach(async () => {
  let options = { scopeName: '_default', collectionName: 'profile' }

  const ottoman = new Ottoman(options)
  await ottoman.connect({
    password,
    username,
    connectionString,
    bucketName,
  })
})

afterEach(async () => {
  for (const instance of getOttomanInstances()) {
    await instance.close()
  }
})
