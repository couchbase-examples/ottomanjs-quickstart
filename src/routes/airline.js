import express from 'express'
import {
  createAirline,
  getAirline,
  updateAirline,
  deleteAirline,
  listAirlines,
  getAirlinesToAirport,
} from '../controllers/airlineController'

const router = express.Router()

router.get('/list', listAirlines)

router.get('/to-airport', getAirlinesToAirport)

router.post('/', createAirline)

router.get('/:id', getAirline)

router.put('/', updateAirline)

router.delete('/:id', deleteAirline)

export default router
