import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, testCode, testId, testName } from './testData'
import { AirportModel } from '../src/models/airportModel'

const airport = new AirportModel({
  airportName: testName('Test Airport'),
  city: testName('Test City'),
  country: 'Test Country',
  id: testId('airport'),
  faa: testCode('FAA'),
})

describe('DELETE /api/v1/airport/{id}', () => {
  describe('given we pass a id as request param', () => {
    beforeEach(async () => {
      await airport
        .save()
        .then(() => {
          console.log('test item inserted', airport)
        })
        .catch((e) => console.log(`Test Airport Insert Failed: ${e.message}`))
    })

    test('should respond with status code 204 Deleted', async () => {
      await delay(500)
      const response = await request(app)
        .delete(`/api/v1/airport/${airport.id}`)
        .send()
      expect(response.statusCode).toBe(204)
    })
  })
})
