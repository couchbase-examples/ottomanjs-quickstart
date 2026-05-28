import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, testCode, testId, testName } from './testData'
import { AirportModel } from '../src/models/airportModel'

const airport = new AirportModel({
  airportName: testName('Test Airport'),
  city: testName('Test City'),
  country: 'Test Country',
  id: testId('airport'),
  faa: testCode('FAA'),
})

describe('POST /api/v1/airport/', () => {
  describe('given a request with airport data', () => {
    const expected = { statusCode: 201, message: '' }
    let id

    test('should respond with statusCode 200 and return document persisted', async () => {
      await delay(500)
      const response = await request(app).post('/api/v1/airport/').send(airport)

      id = response.body.id

      delete response.body.id

      expect(response.statusCode).toBe(expected.statusCode)
      expect(response.body).toMatchObject({
        airportName: airport.airportName,
        city: airport.city,
        country: airport.country,
        faa: airport.faa,
      })
    })

    afterEach(async () => {
      await AirportModel.removeById(id)
        .then(() => {
          console.log('test airport document deleted', id)
        })
        .catch((e) => console.log(`test airport remove failed: ${e.message}`))
    })
  })
})
