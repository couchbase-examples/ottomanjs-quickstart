import {
  request, describe, test, expect,    //supertes
  getDefaultInstance,                 // ottoman
  app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { AirlineModel } from '../src/models/airlineModel'

describe('DELETE /api/v1/airline/{id}', () => {
  describe('given we pass a id as request param', () => {
    var airline = new AirlineModel({
      name: 'Test Name', icao: 'TEST',
      country: 'Test Country', id: '777'
    })

    beforeEach(async () => {
      await airline.save()
        .then(() => { console.log('test item inserted', airline) })
        .catch((e) => console.log(`Test Airline Insert Failed: ${e.message}`))
    })

    test('should respond with status code 204 Deleted', async () => {
      await startInTest(getDefaultInstance())
      await delay(500)
      const response = await request(app).delete(`/api/v1/airline/${airline.id}`).send()
      expect(response.statusCode).toBe(204)
    })

  })
})
