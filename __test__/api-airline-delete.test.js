import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, testCode, testId, testName } from './testData'
import { AirlineModel } from '../src/models/airlineModel'

const airline = new AirlineModel({
  name: testName('Test Airline'),
  icao: testCode('TD'),
  country: 'Test Country',
  id: testId('airline'),
})

describe('DELETE /api/v1/airline/{id}', () => {
  describe('given we pass a id as request param', () => {
    beforeEach(async () => {
      await airline
        .save()
        .then(() => {
          console.log('test item inserted', airline)
        })
        .catch((e) => console.log(`Test Airline Insert Failed: ${e.message}`))
    })

    test('should respond with status code 204 Deleted', async () => {
      await delay(500)
      const response = await request(app)
        .delete(`/api/v1/airline/${airline.id}`)
        .send()
      expect(response.statusCode).toBe(204)
    })
  })
})
