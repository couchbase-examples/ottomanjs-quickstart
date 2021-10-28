import {
  request, describe, test, expect,    //supertes
  bcrypt,                             // utilities
  getDefaultInstance,                 // ottoman
  app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { ProfileModel } from '../src/shared/profiles.model'

describe('GET /profile/{id}', () => {
  describe('given we pass a pid as request param', () => {
    var profile = new ProfileModel({
      firstName: 'Joseph', lastName: 'Developer',
      email: 'joseph.developer@couchbase.com', pass: bcrypt.hashSync('mypassword', 10)
    })

    beforeEach(async() => {
      await profile.save()
        .then(() => { console.log('test profile document inserted', profile) })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and return profile as object', async() => {
      await startInTest(getDefaultInstance())
      await delay(500)
      const response = await request(app).get(`/profile/${profile.pid}`).send()
      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject(profile)
    })

    afterEach(async() => {
      await ProfileModel.removeById(profile.pid)
        .then(() => { console.log('test profile document deleted', profile) })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

  })
})
