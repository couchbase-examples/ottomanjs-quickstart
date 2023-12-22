import {
    request, describe, test, expect,    //supertes
    app                                 // REST application
} from './imports'

import { delay } from './testData'
import { AirportModel } from '../src/models/airportModel'

describe('GET /api/v1/airport/{id}', () => {
    describe('given we pass a id as request param', () => {
        var airport = new AirportModel({
            airportName: 'Test Name', city: 'Test City',
            country: 'Test Country', id: '777', faa: 'TESTFAA'
        })

        beforeEach(async () => {
            await airport.save()
                .then(() => { console.log('test airport document inserted', airport) })
                .catch((e) => console.log(`test airport insert failed: ${e.message}`))
        })

        test('should respond with status code 200 OK and return airport as object', async () => {
            await delay(500)
            const response = await request(app).get(`/api/v1/airport/${airport.id}`).send()
            expect(response.statusCode).toBe(200)
            expect(response.body).toMatchObject(airport)
        })

        afterEach(async () => {
            await AirportModel.removeById(airport.id)
                .then(() => { console.log('test airport document deleted', airport) })
                .catch((e) => console.log(`test airport remove failed: ${e.message}`))
        })

    })
})
