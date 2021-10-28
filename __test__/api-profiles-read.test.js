import {
  request, describe, test, expect,    //supertes
  bcrypt,                             // utilities
  getDefaultInstance,                 // ottoman
  app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { ProfileModel } from '../src/shared/profiles.model'

describe('GET /profiles', () => {
  describe('given we get profiles with skip 1, limit 1, and search text of "jo"', () => {
    var profile1 = new ProfileModel({
      firstName: 'Joe', lastName: 'Schmoe',
      email: 'joe.schmoe@couchbase.com', pass: bcrypt.hashSync('mypassword1', 10)
    })
    var profile2 = new ProfileModel({
      firstName: 'John', lastName: 'Dear',
      email: 'john.dear@couchbase.com', pass: bcrypt.hashSync('mypassword2', 10)
    })
    
    beforeEach(async () => {
      await profile1.save()
        .then(() => { console.log('test profile document inserted', profile1) })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
      await profile2.save()
        .then(() => { console.log('test profile document inserted', profile2) })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
      await delay(2000)
    })
    test('should respond with status code 200 OK and return two documents', async () => {
      await startInTest(getDefaultInstance())
      await delay(500)
      const response = await request(app)
        .get(`/profiles`)
        .query({
          skip: 0, limit: 5, search: 'jo'
        })
      expect(response.statusCode).toBe(200)
      expect(response.body.items).toHaveLength(2)
    })

    afterEach(async () => {
      await ProfileModel.removeById(profile1.pid)
        .then(() => { console.log('test profile document deleted', profile1) })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
      await ProfileModel.removeById(profile2.pid)
        .then(() => { console.log('test profile document deleted', profile2) })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })
  })
})

