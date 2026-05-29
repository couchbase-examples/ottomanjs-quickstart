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

describe('GET /api/v1/route/{id}', () => {
  describe('given we pass a id as request param', () => {
    beforeEach(async () => {
      await route
        .save()
        .then(() => {
          console.log('test route document inserted', route)
        })
        .catch((e) => console.log(`test route insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and return route as object', async () => {
      await delay(500)
      const response = await request(app)
        .get(`/api/v1/route/${route.id}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject(route)
    })

    afterEach(async () => {
      await RouteModel.removeById(route.id)
        .then(() => {
          console.log('test route document deleted', route)
        })
        .catch((e) => console.log(`test route remove failed: ${e.message}`))
    })
  })
})
