import {
    request, describe, test, expect,    //supertes
    getDefaultInstance,                 // ottoman
    app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { RouteModel } from '../src/models/routeModel'

describe('POST /api/v1/route/', () => {

    var route = new RouteModel({
        airline: 'Test Airline', airlineid: 'Test AirlineId',
        sourceairport: 'Test Airport', id: '777', destinationairport: 'TESTFAA'
    })

    describe('given a request with route data', () => {
        const expected = { statusCode: 201, message: '' }
        let id

        test('should respond with statusCode 200 and return document persisted', async () => {
            await startInTest(getDefaultInstance())
            await delay(500)
            const response = await request(app).post('/api/v1/route/').send(route)

            id = response.body.id

            delete response.body.id;

            expect(response.statusCode).toBe(expected.statusCode)
            expect(response.body).toMatchObject({
                airline: route.airline, airlineid: route.airlineid, sourceairport: route.sourceairport, destinationairport: route.destinationairport
            })
        })

        afterEach(async () => {
            await RouteModel.removeById(id)
                .then(() => { console.log('test route document deleted', id) })
                .catch((e) => console.log(`test route remove failed: ${e.message}`))
        })

    })

})
