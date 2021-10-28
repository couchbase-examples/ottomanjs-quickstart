import {
  request, describe, test, expect,    //supertes
  bcrypt,                             // utilities
  getDefaultInstance,                 // ottoman
  app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { ProfileModel } from '../src/shared/profiles.model'

describe('PUT /profile', () => {
  describe('given the profile object is updated', () => {
    const initialProfile = new ProfileModel({
      firstName: 'Joseph', lastName: 'Developer',
      email: 'joseph.developer@couchbase.com', pass: bcrypt.hashSync('mypassword', 10)
    })
    const updatedProfile = {
      firstName: 'Joe', lastName: 'dev',
      email: 'joe@dev.com', pass: 'p455w3rd'
    }

    beforeEach(async() => {
      await initialProfile.save()
        .then(() => { console.log('test profile document inserted', initialProfile) })
        .catch((e) => console.log(`test profile insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and updated values of document returned', async() => {
      await startInTest(getDefaultInstance())
      await delay(500)
      const response = await request(app).put(`/profile/${initialProfile.pid}`).send(updatedProfile)
      expect(response.statusCode).toBe(200)
      expect(response.body.firstName).toBe(updatedProfile.firstName)
      expect(response.body.lastName).toBe(updatedProfile.lastName)
      expect(response.body.email).toBe(updatedProfile.email)
      expect(response.body.pass).not.toBe(updatedProfile.pass)
    })

    afterEach(async() => {
      await ProfileModel.removeById(initialProfile.pid)
        .then(() => { console.log('test profile document deleted', initialProfile) })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

  })
})
