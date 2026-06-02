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

describe('POST /api/v1/route/', () => {
  describe('given a request with route data', () => {
    const expected = { statusCode: 201, message: '' }
    let id

    test('should respond with statusCode 200 and return document persisted', async () => {
      await delay(500)
      const response = await request(app).post('/api/v1/route/').send(route)

      id = response.body.id

      delete response.body.id

      expect(response.statusCode).toBe(expected.statusCode)
      expect(response.body).toMatchObject({
        airline: route.airline,
        airlineid: route.airlineid,
        sourceairport: route.sourceairport,
        destinationairport: route.destinationairport,
      })
    })

    afterEach(async () => {
      await RouteModel.removeById(id)
        .then(() => {
          console.log('test route document deleted', id)
        })
        .catch((e) => console.log(`test route remove failed: ${e.message}`))
    })
  })
})
