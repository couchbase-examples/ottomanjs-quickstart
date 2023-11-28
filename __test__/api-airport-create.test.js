import {
    request, describe, test, expect,    //supertes
    getDefaultInstance,                 // ottoman
    app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { AirportModel } from '../src/models/airportModel'

describe('POST /api/v1/airport/', () => {

    var airport = new AirportModel({
        airportName: 'Test Name', city: 'Test City',
        country: 'Test Country', id: '777', faa: 'TESTFAA'
    })

    describe('given a request with airport data', () => {
        const expected = { statusCode: 201, message: '' }
        let id

        test('should respond with statusCode 200 and return document persisted', async () => {
            await startInTest(getDefaultInstance())
            await delay(500)
            const response = await request(app).post('/api/v1/airport/').send(airport)

            id = response.body.id

            delete response.body.id;

            expect(response.statusCode).toBe(expected.statusCode)
            expect(response.body).toMatchObject({
                airportName: airport.airportName, city: airport.city, country: airport.country, faa: airport.faa
            })
        })

        afterEach(async () => {
            await AirportModel.removeById(id)
                .then(() => { console.log('test airport document deleted', id) })
                .catch((e) => console.log(`test airport remove failed: ${e.message}`))
        })

    })

})
