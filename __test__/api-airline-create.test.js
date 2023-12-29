import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { AirlineModel } from '../src/models/airlineModel'

describe('POST /api/v1/airline/', () => {
  var airline = new AirlineModel({
    name: 'Test Name',
    icao: 'TEST',
    country: 'Test Country',
    id: '777',
  })

  describe('given a request with airline data', () => {
    const expected = { statusCode: 201, message: '' }
    let id

    test('should respond with statusCode 200 and return document persisted', async () => {
      await delay(500)
      const response = await request(app).post('/api/v1/airline/').send(airline)

      id = response.body.id

      delete response.body.id

      expect(response.statusCode).toBe(expected.statusCode)
      expect(response.body).toMatchObject({
        name: airline.name,
        icao: airline.icao,
        country: airline.country,
      })
    })

    afterEach(async () => {
      await AirlineModel.removeById(id)
        .then(() => {
          console.log('test airline document deleted', id)
        })
        .catch((e) => console.log(`test airline remove failed: ${e.message}`))
    })
  })
})
