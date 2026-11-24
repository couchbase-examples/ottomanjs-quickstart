import { makeResponse } from '../shared/makeResponse'
import { makeCrudController } from '../shared/crudController'
import { AirlineModel } from '../models/airlineModel'
import { Query, ottoman } from '../../db/ottomanConnection.js'

const {
  create: createAirline,
  read: getAirline,
  update: updateAirline,
  remove: deleteAirline,
} = makeCrudController(AirlineModel)

const listAirlines = async (req, res) => {
  const country = req.query.country || ''
  const limit = parseInt(req.query.limit, 10) || 10
  const offset = parseInt(req.query.offset, 10) || 0
  let filter = {}
  if (country) {
    filter.country = country
  }

  const options = { limit: limit, offset: offset }
  await makeResponse(res, async () => {
    const airlines = await AirlineModel.find(filter, options)
    return airlines.rows
  })
}

const getAirlinesToAirport = async (req, res) => {
  const airport = req.query.airport
  const limit = parseInt(req.query.limit, 10) || 10
  const offset = parseInt(req.query.offset, 10) || 0

  // Subquery to get distinct airline IDs
  const subquery = new Query({}, 'travel-sample.inventory.route')
    .select([{ $field: 'DISTINCT META(airline).id AS airlineId' }])
    .plainJoin(
      'JOIN `travel-sample`.inventory.airline ON route.airlineid = META(airline).id',
    )
    .where({ 'route.destinationairport': { $eq: airport } })

  // Main query to join with the subquery
  const mainQuery = new Query({}, 'travel-sample.inventory.airline AS air')
    .select([
      { $field: 'air.callsign' },
      { $field: 'air.country' },
      { $field: 'air.iata' },
      { $field: 'air.icao' },
      { $field: 'air.name' },
    ])
    .plainJoin(
      `JOIN (${subquery.build()}) AS subquery ON META(air).id = subquery.airlineId`,
    )
    .orderBy({ 'air.name': 'ASC' })
    .limit(limit)
    .offset(offset)
  await makeResponse(res, async () => {
    const result = await ottoman.query(mainQuery.build())
    return result.rows
  })
}

export {
  createAirline,
  getAirline,
  updateAirline,
  deleteAirline,
  listAirlines,
  getAirlinesToAirport,
}
