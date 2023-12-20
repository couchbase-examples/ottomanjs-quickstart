import {
    request, describe, test, expect,    //supertes
    getDefaultInstance,                 // ottoman
    app                                 // REST application
} from './imports'

import { delay, startInTest } from './testData'
import { AirportModel } from '../src/models/airportModel'
import { RouteModel } from '../src/models/routeModel'

describe('GET /api/v1/airport/direct-connections', () => {
    describe('given airport limit & offset as req params"', () => {
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
        test('should respond with status code 200 OK and return the direct connection documents', async () => {
            await startInTest(getDefaultInstance())
            await delay(500)
            const response = await request(app)
                .get(`/api/v1/airport/direct-connections`)
                .query({
                    offset: 0, limit: 5, airport: 'TESTFAA'
                })
            expect(response.statusCode).toBe(200)
        },40000)

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