import {
  request, describe, test, expect,    //supertes
  app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { AirlineModel } from '../src/models/airlineModel'

describe('GET /api/v1/airline/{id}', () => {
  describe('given we pass a id as request param', () => {
    var airline = new AirlineModel({
      name: 'Test Name', icao: 'TEST',
      country: 'Test Country', id: '777'
    })

    beforeEach(async () => {
      await airline.save()
        .then(() => { console.log('test airline document inserted', airline) })
        .catch((e) => console.log(`test airline insert failed: ${e.message}`))
    })

    test('should respond with status code 200 OK and return airline as object', async () => {
      await delay(500)
      const response = await request(app).get(`/api/v1/airline/${airline.id}`).send()
      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject(airline)
    })

    afterEach(async () => {
      await AirlineModel.removeById(airline.id)
        .then(() => { console.log('test airline document deleted', airline) })
        .catch((e) => console.log(`test airline remove failed: ${e.message}`))
    })

  })
})
