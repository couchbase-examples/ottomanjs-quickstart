import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay } from './testData'
import { AirlineModel } from '../src/models/airlineModel'

describe('PUT /api/v1/airline/', () => {
  describe('given the airline object is updated', () => {
    var initialAirline = new AirlineModel({
      name: 'Initial Test Name',
      icao: 'INITIALTEST',
      country: 'Initial Test Country',
      id: '777',
    })
    var updatedAirline = new AirlineModel({
      name: 'Update Test Name',
      icao: 'UPDATETEST',
      country: 'Update Test Country',
      id: '777',
    })

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
