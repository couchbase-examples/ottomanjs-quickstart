import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, testCode, testId, testName } from './testData'
import { AirlineModel } from '../src/models/airlineModel'

const airline = new AirlineModel({
  name: testName('Test Airline'),
  icao: testCode('TR'),
  country: 'Test Country',
  id: testId('airline'),
})

describe('GET /api/v1/airline/{id}', () => {
  describe('given we pass a id as request param', () => {
    beforeEach(async () => {
      await airline
        .save()
        .then(() => {
          console.log('test airline document inserted', airline)
        })
        .catch((e) => console.log(`test airline insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and return airline as object', async () => {
      await delay(500)
      const response = await request(app)
        .get(`/api/v1/airline/${airline.id}`)
        .send()
      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject(airline)
    })

    afterEach(async () => {
      await AirlineModel.removeById(airline.id)
        .then(() => {
          console.log('test airline document deleted', airline)
        })
        .catch((e) => console.log(`test airline remove failed: ${e.message}`))
    })
  })
})
