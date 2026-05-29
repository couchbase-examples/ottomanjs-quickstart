import { request, describe, test, expect, app } from './imports'

import { delay, testCode, testId, testName } from './testData'
import { AirlineModel } from '../src/models/airlineModel'
import { RouteModel } from '../src/models/routeModel'

const destinationAirport = testCode('FAA')
const airline1 = new AirlineModel({
  name: testName('Initial Test Airline'),
  icao: testCode('AT'),
  country: 'Test Country',
  id: testId('airline'),
})

const airline2 = new AirlineModel({
  name: testName('Updated Test Airline'),
  icao: testCode('AT'),
  country: 'Test Country',
  id: testId('airline'),
})

const route1 = new RouteModel({
  airlineid: airline1.id,
  destinationairport: destinationAirport,
  sourceairport: testCode('SRC'),
  airline: testName('Test Airline'),
})

describe('GET /api/v1/airline/list', () => {
  describe('given airport limit & offset as request params', () => {
    beforeEach(async () => {
      await airline1
        .save()
        .then(() => {
          console.log('test airline document inserted', airline1)
        })
        .catch((e) => console.log(`test airline insert failed: ${e.message}`))

      await airline2
        .save()
        .then(() => {
          console.log('test airline document inserted', airline2)
        })
        .catch((e) => console.log(`test airline insert failed: ${e.message}`))

      await route1
        .save()
        .then(() => {
          console.log('test route document inserted', route1)
        })
        .catch((e) => console.log(`test route insert failed: ${e.message}`))

      await delay(2000)
    })

    test('should respond with status code 200 OK and return the documents', async () => {
      await delay(500)
      const response = await request(app).get(`/api/v1/airline/list`).query({
        offset: 0,
        limit: 5,
        airport: destinationAirport,
      })
      expect(response.statusCode).toBe(200)
    })

    afterEach(async () => {
      await AirlineModel.removeById(airline1.id)
        .then(() => {
          console.log('test airline document deleted', airline1)
        })
        .catch((e) => console.log(`test airline remove failed: ${e.message}`))

      await AirlineModel.removeById(airline2.id)
        .then(() => {
          console.log('test airline document deleted', airline2)
        })
        .catch((e) => console.log(`test airline remove failed: ${e.message}`))

      await RouteModel.removeById(route1.id)
        .then(() => {
          console.log('test route document deleted', route1)
        })
        .catch((e) => console.log(`test route remove failed: ${e.message}`))
    })
  })
})
