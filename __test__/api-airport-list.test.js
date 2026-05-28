import {
  request,
  describe,
  test,
  expect, //supertes
  app, // REST application
} from './imports'

import { delay, testCode, testId, testName } from './testData'
import { AirportModel } from '../src/models/airportModel'

const airport1 = new AirportModel({
  airportName: testName('Initial Test Airport'),
  city: testName('Initial Test City'),
  country: 'Test Country',
  id: testId('airport'),
  faa: testCode('FAA'),
})
const airport2 = new AirportModel({
  airportName: testName('Updated Test Airport'),
  city: testName('Updated Test City'),
  country: 'Test Country',
  id: testId('airport'),
  faa: testCode('FAA'),
})

describe('GET /api/v1/airport/list', () => {
  describe('given country limit & offset as request params "', () => {
    beforeEach(async () => {
      await airport1
        .save()
        .then(() => {
          console.log('test airport document inserted', airport1)
        })
        .catch((e) => console.log(`test airport insert failed: ${e.message}`))
      await airport2
        .save()
        .then(() => {
          console.log('test airport document inserted', airport2)
        })
        .catch((e) => console.log(`test airport insert failed: ${e.message}`))
      await delay(2000)
    })
    test('should respond with status code 200 OK and return the documents', async () => {
      await delay(500)
      const response = await request(app).get(`/api/v1/airport/list`).query({
        offset: 0,
        limit: 5,
        country: 'Test Country',
      })
      expect(response.statusCode).toBe(200)
      // expect(response.body.items).toHaveLength(2)
    })

    afterEach(async () => {
      await AirportModel.removeById(airport1.id)
        .then(() => {
          console.log('test airport document deleted', airport1)
        })
        .catch((e) => console.log(`test airport remove failed: ${e.message}`))
      await AirportModel.removeById(airport2.id)
        .then(() => {
          console.log('test airport document deleted', airport2)
        })
        .catch((e) => console.log(`test airport remove failed: ${e.message}`))
    })
  })
})
