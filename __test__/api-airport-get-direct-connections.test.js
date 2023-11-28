import {
    request, describe, test, expect,    //supertes
    getDefaultInstance,                 // ottoman
    app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { AirportModel } from '../src/models/airportModel'
import { RouteModel } from '../src/models/routeModel'

describe('GET /api/v1/airport/direct-connections', () => {
    describe('given we get airports with skip 0, limit 5 and with required query"', () => {
        var airport = new AirportModel({
            airportName: 'Initial Test Name', city: 'Initial Test City',
            country: 'Initial Test Country', id: '777', faa: 'TESTFAA'
        })
        var route = new RouteModel({
            airline: 'Test Airline', airlineid: 'Test AirlineId',
            sourceairport: 'TESTFAA', id: '777', destinationairport: 'Test Destination Airport'
        })

        beforeEach(async () => {
            await airport.save()
                .then(() => { console.log('test airport document inserted', airport) })
                .catch((e) => console.log(`test airport insert failed: ${e.message}`))
            await route.save()
                .then(() => { console.log('test airport document inserted', route) })
                .catch((e) => console.log(`test airport insert failed: ${e.message}`))
            await delay(2000)
        })
        test('should respond with status code 200 OK and return two documents', async () => {
            await startInTest(getDefaultInstance())
            await delay(500)
            const response = await request(app)
                .get(`/api/v1/airport/direct-connections`)
                .query({
                    offset: 0, limit: 5, airport: 'TESTFAA'
                })
            expect(response.statusCode).toBe(200)
            // expect(response.body.items).toContainEqual({ destinationairport: 'Test Destination Airport' });
            // expect(response.body.items).toContainEqual({ destinationairport: 'Initial Test City' });
            // expect(response.body.items).toHaveLength(2)
        })

        afterEach(async () => {
            await AirportModel.removeById(airport.id)
                .then(() => { console.log('test airport document deleted', airport) })
                .catch((e) => console.log(`test airport remove failed: ${e.message}`))
            await RouteModel.removeById(route.id)
                .then(() => { console.log('test airport document deleted', route) })
                .catch((e) => console.log(`test airport remove failed: ${e.message}`))
        })
    })
})