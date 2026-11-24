import { makeResponse } from '../shared/makeResponse'
import { makeCrudController } from '../shared/crudController'
import { AirportModel } from '../models/airportModel'
import { Query, ottoman } from '../../db/ottomanConnection.js'

const {
  create: createAirport,
  read: getAirport,
  update: updateAirport,
  remove: deleteAirport,
} = makeCrudController(AirportModel)

const listAirports = async (req, res) => {
  const country = req.query.country || ''
  const limit = parseInt(req.query.limit, 10) || 10
  const offset = parseInt(req.query.offset, 10) || 0
  let filter = {}
  if (country) {
    filter.country = country
  }

  const options = { limit: limit, offset: offset }
  await makeResponse(res, async () => {
    const airports = await AirportModel.find(filter, options)
    return airports.rows
  })
}

const getDirectConnections = async (req, res) => {
  const airport = req.query.airport
  const limit = parseInt(req.query.limit, 10) || 10
  const offset = parseInt(req.query.offset, 10) || 0
  // Subquery to get distinct airline IDs
  const subquery = new Query({}, 'travel-sample.inventory.route')
    .select([{ $field: 'DISTINCT route.destinationairport' }])
    .plainJoin(
      'JOIN `travel-sample`.inventory.airport AS airport ON route.sourceairport = airport.faa',
    )
    .where({
      'airport.faa': { $eq: airport },
      'route.stops': { $eq: 0 },
    })
    .orderBy({ 'route.destinationairport': 'ASC' })
    .limit(limit)
    .offset(offset)

  await makeResponse(res, async () => {
    const result = await ottoman.query(subquery.build())
    return result.rows
  })
}

export {
  createAirport,
  getAirport,
  updateAirport,
  deleteAirport,
  listAirports,
  getDirectConnections,
}
