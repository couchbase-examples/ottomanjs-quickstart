import { model, Schema } from 'ottoman'

// Geo sub-schema
const GeoSchema = new Schema({
  alt: { type: Number },
  lat: { type: Number },
  lon: { type: Number },
})

const AirportSchema = new Schema({
  airportName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  faa: { type: String, required: true },
  geo: GeoSchema,
  icao: { type: String, required: false },
  tz: { type: String, required: false },
})

const AirportModel = model('airport', AirportSchema, {
  modelKey: 'type',
  collectionName: 'airport',
  keyGeneratorDelimiter: '_',
})

module.exports = {
  AirportModel,
}
