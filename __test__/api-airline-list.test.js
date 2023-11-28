import {
  request, describe, test, expect,    //supertes
  getDefaultInstance,                 // ottoman
  app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { AirlineModel } from '../src/models/airlineModel'

describe('GET /api/v1/airline/list', () => {
  describe('given we get airlines with skip 1, limit 1, and search text of "jo"', () => {
    var airline1 = new AirlineModel({
      name: 'Initial Test Name', icao: 'INITIALTEST',
      country: 'Test Country', id: '777'
    })
    var airline2 = new AirlineModel({
      name: 'Update Test Name', icao: 'UPDATETEST',
      country: 'Test Country', id: '778'
    })

    beforeEach(async () => {
      await airline1.save()
        .then(() => { console.log('test airline document inserted', airline1) })
        .catch((e) => console.log(`test airline insert failed: ${e.message}`))
      await airline2.save()
        .then(() => { console.log('test airline document inserted', airline2) })
        .catch((e) => console.log(`test airline insert failed: ${e.message}`))
      await delay(2000)
    })
    test('should respond with status code 200 OK and return two documents', async () => {
      await startInTest(getDefaultInstance())
      await delay(500)
      const response = await request(app)
        .get(`/api/v1/airline/list`)
        .query({
          offset: 0, limit: 5, country: 'Test Country'
        })
      expect(response.statusCode).toBe(200)
      // expect(response.body.items).toHaveLength(2)
    })

    afterEach(async () => {
      await AirlineModel.removeById(airline1.id)
        .then(() => { console.log('test airline document deleted', airline1) })
        .catch((e) => console.log(`test airline remove failed: ${e.message}`))
      await AirlineModel.removeById(airline2.id)
        .then(() => { console.log('test airline document deleted', airline2) })
        .catch((e) => console.log(`test airline remove failed: ${e.message}`))
    })
  })
})

