import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { AirportModel } from '../src/models/airportModel'

describe('DELETE /api/v1/airport/{id}', () => {
  describe('given we pass a id as request param', () => {
    var airport = new AirportModel({
      airportName: 'Test Name',
      city: 'Test City',
      country: 'Test Country',
      id: '777',
      faa: 'TESTFAA',
    })

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
