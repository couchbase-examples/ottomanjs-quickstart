import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, testCode, testId, testName } from './testData'
import { AirportModel } from '../src/models/airportModel'

const airportId = testId('airport')
const airportCode = testCode('FAA')
const initialAirport = new AirportModel({
  airportName: testName('Initial Test Airport'),
  city: testName('Initial Test City'),
  country: 'Initial Test Country',
  id: airportId,
  faa: airportCode,
})
const updatedAirport = new AirportModel({
  airportName: testName('Updated Test Airport'),
  city: testName('Updated Test City'),
  country: 'Updated Test Country',
  id: airportId,
  faa: airportCode,
})

describe('PUT /api/v1/airport/', () => {
  describe('given the airport object is updated', () => {
    beforeEach(async () => {
      await initialAirport
        .save()
        .then(() => {
          console.log('test airport document inserted', initialAirport)
        })
        .catch((e) => console.log(`test airport insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and updated values of document returned', async () => {
      await delay(500)
      const response = await request(app)
        .put(`/api/v1/airport/`)
        .send(updatedAirport)
      expect(response.statusCode).toBe(200)
      expect(response.body.airportName).toBe(updatedAirport.airportName)
      expect(response.body.city).toBe(updatedAirport.city)
      expect(response.body.country).toBe(updatedAirport.country)
    })

    afterEach(async () => {
      await AirportModel.removeById(initialAirport.id)
        .then(() => {
          console.log('test airport document deleted', initialAirport)
        })
        .catch((e) => console.log(`test airport remove failed: ${e.message}`))
    })
  })
})
