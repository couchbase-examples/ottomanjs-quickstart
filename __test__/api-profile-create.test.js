import {
  request, describe, test, expect,    //supertes
  bcrypt,                             // utilities
  getDefaultInstance,                 // ottoman
  app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { ProfileModel } from '../src/shared/profiles.model'

describe('POST /profile', () => {

  const profile = {
    firstName: 'Joe', lastName: 'dev',
    email: 'joe@dev.com', pass: 'p455w3rd'
  }

  describe('given a request with user & pass', () => {
    const expected = { statusCode: 200, message: '' }
    let pid

    test('should respond with statusCode 200 and return document persisted', async() => {
      await startInTest(getDefaultInstance())
      await delay(500)
      const response = await request(app).post('/profile').send(profile)

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
      await ProfileModel.removeById(pid)
        .then(() => { console.log('test profile document deleted', pid) })
        .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })

  })

})
