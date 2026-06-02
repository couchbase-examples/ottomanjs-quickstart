import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, testCode, testId, testName } from './testData'
import { RouteModel } from '../src/models/routeModel'

const routeId = testId('route')
const initialRoute = new RouteModel({
  airline: testName('Initial Test Airline'),
  airlineid: testId('airline'),
  sourceairport: testName('Initial Test Airport'),
  id: routeId,
  destinationairport: testCode('FAA'),
})
const updatedRoute = new RouteModel({
  airline: testName('Updated Test Airline'),
  airlineid: testId('airline'),
  sourceairport: testName('Updated Test Airport'),
  id: routeId,
  destinationairport: testCode('FAA'),
})

describe('PUT /api/v1/route/', () => {
  describe('given the route object is updated', () => {
    beforeEach(async () => {
      await initialRoute
        .save()
        .then(() => {
          console.log('test route document inserted', initialRoute)
        })
        .catch((e) => console.log(`test route insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and updated values of document returned', async () => {
      await delay(500)
      const response = await request(app)
        .put(`/api/v1/route/`)
        .send(updatedRoute)
      expect(response.statusCode).toBe(200)
      expect(response.body.Airline).toBe(updatedRoute.Airline)
      expect(response.body.Airline_id).toBe(updatedRoute.Airline_id)
      expect(response.body.SourceAirport).toBe(updatedRoute.SourceAirport)
      expect(response.body.DestinationAirport).toBe(
        updatedRoute.DestinationAirport,
      )
    })

    afterEach(async () => {
      await RouteModel.removeById(initialRoute.id)
        .then(() => {
          console.log('test route document deleted', initialRoute)
        })
        .catch((e) => console.log(`test route remove failed: ${e.message}`))
    })
  })
})
