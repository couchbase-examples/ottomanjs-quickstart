import { request, describe, test, expect, app } from './imports'

import { delay } from './testData'
import { AirlineModel } from '../src/models/airlineModel'
import { RouteModel } from '../src/models/routeModel'

describe('GET /api/v1/airline/list', () => {
  describe('given airport limit & offset as request params', () => {
    var airline1 = new AirlineModel({
      name: 'Initial Test Name',
      icao: 'INITIALTEST',
      country: 'Test Country',
      id: '777',
    })

    var airline2 = new AirlineModel({
      name: 'Update Test Name',
      icao: 'UPDATETEST',
      country: 'Test Country',
      id: '778',
    })

    var route1 = new RouteModel({
      airlineid: airline1.id,
      destinationairport: 'FAA',
      sourceairport: 'TESTSOURCE',
      airline: 'TESTAIRLINE',
    })

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
        airport: 'FAA',
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
