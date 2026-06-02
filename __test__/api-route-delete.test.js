import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, testCode, testId, testName } from './testData'
import { RouteModel } from '../src/models/routeModel'

const route = new RouteModel({
  airline: testName('Test Airline'),
  airlineid: testId('airline'),
  sourceairport: testName('Test Airport'),
  id: testId('route'),
  destinationairport: testCode('FAA'),
})

describe('DELETE /api/v1/route/{id}', () => {
  describe('given we pass a id as request param', () => {
    beforeEach(async () => {
      await route
        .save()
        .then(() => {
          console.log('test item inserted', route)
        })
        .catch((e) => console.log(`Test Route Insert Failed: ${e.message}`))
    })

    test('should respond with status code 204 Deleted', async () => {
      await delay(500)
      const response = await request(app)
        .delete(`/api/v1/route/${route.id}`)
        .send()
      expect(response.statusCode).toBe(204)
    })
  })
})
