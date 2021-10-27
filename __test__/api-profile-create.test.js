import {
  request, describe, test, expect,    //supertes
  bcrypt,                             // utilities
  getDefaultInstance,                 // ottoman
  app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData';

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
      await startInTest(getDefaultInstance())
      await delay(500);
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
      console.log(`after each`)
    })

  })

})
