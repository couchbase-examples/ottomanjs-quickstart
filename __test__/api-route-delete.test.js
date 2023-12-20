import {
    request, describe, test, expect,    //supertes
    getDefaultInstance,                 // ottoman
    app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { RouteModel } from '../src/models/routeModel'

describe('DELETE /api/v1/route/{id}', () => {
    describe('given we pass a id as request param', () => {
        var route = new RouteModel({
            airline: 'Test Airline', airlineid: 'Test AirlineId',
            sourceairport: 'Test Airport', id: '777', destinationairport: 'TESTFAA'
        })

        beforeEach(async () => {
            await route.save()
                .then(() => { console.log('test item inserted', route) })
                .catch((e) => console.log(`Test Route Insert Failed: ${e.message}`))
        })

        test('should respond with status code 204 Deleted', async () => {
            await startInTest(getDefaultInstance())
            await delay(500)
            const response = await request(app).delete(`/api/v1/route/${route.id}`).send()
            expect(response.statusCode).toBe(204)
        })

    })
})
