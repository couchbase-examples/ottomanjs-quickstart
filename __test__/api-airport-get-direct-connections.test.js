import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, testCode, testId, testName } from './testData'
import { AirportModel } from '../src/models/airportModel'
import { RouteModel } from '../src/models/routeModel'

const airportCode = testCode('FAA')
const airport = new AirportModel({
  airportName: testName('Initial Test Airport'),
  city: testName('Initial Test City'),
  country: 'Initial Test Country',
  id: testId('airport'),
  faa: airportCode,
})
const route = new RouteModel({
  airline: testName('Test Airline'),
  airlineid: testId('airline'),
  sourceairport: airportCode,
  id: testId('route'),
  destinationairport: testName('Destination Airport'),
})

describe('GET /api/v1/airport/direct-connections', () => {
  describe('given airport limit & offset as req params"', () => {
    beforeEach(async () => {
      await airport
        .save()
        .then(() => {
          console.log('test airport document inserted', airport)
        })
        .catch((e) => console.log(`test airport insert failed: ${e.message}`))
      await route
        .save()
        .then(() => {
          console.log('test airport document inserted', route)
        })
        .catch((e) => console.log(`test airport insert failed: ${e.message}`))
      await delay(2000)
    })
    test('should respond with status code 200 OK and return the direct connection documents', async () => {
      await delay(500)
      const response = await request(app)
        .get(`/api/v1/airport/direct-connections`)
        .query({
          offset: 0,
          limit: 5,
          airport: airportCode,
        })
      expect(response.statusCode).toBe(200)
    }, 40000)

    afterEach(async () => {
      await AirportModel.removeById(airport.id)
        .then(() => {
          console.log('test airport document deleted', airport)
        })
        .catch((e) => console.log(`test airport remove failed: ${e.message}`))
      await RouteModel.removeById(route.id)
        .then(() => {
          console.log('test airport document deleted', route)
        })
        .catch((e) => console.log(`test airport remove failed: ${e.message}`))
    })
  })
})
