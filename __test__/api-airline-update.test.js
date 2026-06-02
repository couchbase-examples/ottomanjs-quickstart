import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, testCode, testId, testName } from './testData'
import { AirlineModel } from '../src/models/airlineModel'

const airlineId = testId('airline')
const initialAirline = new AirlineModel({
  name: testName('Initial Test Airline'),
  icao: testCode('AU'),
  country: 'Initial Test Country',
  id: airlineId,
})
const updatedAirline = new AirlineModel({
  name: testName('Updated Test Airline'),
  icao: testCode('AU'),
  country: 'Update Test Country',
  id: airlineId,
})

describe('PUT /api/v1/airline/', () => {
  describe('given the airline object is updated', () => {
    beforeEach(async () => {
      await initialAirline
        .save()
        .then(() => {
          console.log('test airline document inserted', initialAirline)
        })
        .catch((e) => console.log(`test airline insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and updated values of document returned', async () => {
      await delay(500)
      const response = await request(app)
        .put(`/api/v1/airline/`)
        .send(updatedAirline)
      expect(response.statusCode).toBe(200)
      expect(response.body.name).toBe(updatedAirline.name)
      expect(response.body.icao).toBe(updatedAirline.icao)
      expect(response.body.country).toBe(updatedAirline.country)
    })

    afterEach(async () => {
      await AirlineModel.removeById(initialAirline.id)
        .then(() => {
          console.log('test airline document deleted', initialAirline)
        })
        .catch((e) => console.log(`test airline remove failed: ${e.message}`))
    })
  })
})
