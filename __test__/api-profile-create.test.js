import {
  request, describe, test, expect, //supertes
  bcrypt,                          // utilities
  cluster, profileCollection,      // couchbase
  app                              // REST application
} from './imports'

import { getOttomanInstances, Ottoman } from '../db/ottomanConnection'

beforeEach(async () => {
  let options = { scopeName: '_default', collectionName: 'profile' }
  console.log(`options`)
  console.log(options)

  const ottoman = new Ottoman(options)
  console.log(`ottoman`)
  console.log(ottoman)
  await ottoman.connect({
    bucketName: process.env.CB_BUCKET,
    connectionString: process.env.CB_URL,
    username: process.env.CB_USER,
    password: process.env.CB_PASS,
  })
})

afterAll(async () => {
  for (const instance of getOttomanInstances()) {
    await instance.close()
  }
})

describe('POST /profile', () => {

  const profile = {
    firstName: 'Joe', lastName: 'dev',
    email: 'joe@dev.com', pass: 'p455w3rd'
  }

  describe('given a request with user & pass', () => {
    const expected = { statusCode: 200, message: '' }
    let pid

    console.log(`start of the test`)

    test('should respond with statusCode 200 and return document persisted', async() => {
      const response = await request(app).post('/profile').send(profile)
      console.log(`log response from request ${response}`)
      pid = response.body.pid
      const hashedPass = response.body.pass

      delete response.body.pid; delete response.body.pass

      expect(response.statusCode).toBe(expected.statusCode)
      bcrypt.compare(profile.pass, hashedPass, function(err, result) {
        expect(result).toBe(true)
      })
      expect(pid.length).toBe(36)
      expect(response.body).toMatchObject({
        firstName: profile.firstName, lastName: profile.lastName, email: profile.email
      })
    })

    afterEach(async() => {
      await profileCollection.remove(pid)
        .then(() => {/*console.log('test profile document deleted', id)*/ })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

  })

})
