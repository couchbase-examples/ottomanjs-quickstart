import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay } from './testData'
import { AirportModel } from '../src/models/airportModel'

describe('PUT /api/v1/airport/', () => {
  describe('given the airport object is updated', () => {
    var initialAirport = new AirportModel({
      airportName: 'Initial Test Name',
      city: 'Initial Test City',
      country: 'Initial Test Country',
      id: '777',
      faa: 'TESTFAA',
    })
    var updatedAirport = new AirportModel({
      airportName: 'Updated Test Name',
      city: 'Updated Test City',
      country: 'Updated Test Country',
      id: '777',
      faa: 'TESTFAA',
    })

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
