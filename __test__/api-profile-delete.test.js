import {
  request, describe, test, expect,    //supertes
  bcrypt,                             // utilities
  getDefaultInstance,                 // ottoman
  app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { ProfileModel } from '../src/shared/profiles.model'

describe('DELETE /profile/{id}', () => {
  describe('given we pass a pid as request param', () => {
    var profile = new ProfileModel({
      firstName: 'Joseph', lastName: 'Developer',
      email: 'joseph.developer@couchbase.com', pass: bcrypt.hashSync('mypassword', 10)
    })

    beforeEach(async() => {
      await profile.save()
        .then(() => { console.log('test item inserted', profile) })
        .catch((e) => console.log(`Test Profile Insert Failed: ${e.message}`))
    })

    test('should respond with status code 200 OK', async() => {
      await startInTest(getDefaultInstance())
      await delay(500)
      const response = await request(app).delete(`/profile/${profile.pid}`).send()
      expect(response.statusCode).toBe(204)
    })

  })
})
