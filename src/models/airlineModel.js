import { model, Schema } from 'ottoman'

const AirlineSchema = new Schema({
  callsign: { type: String, required: false },
  country: { type: String, required: true },
  iata: { type: String, required: false },
  icao: { type: String, required: true },
  name: { type: String, required: true },
  id: { type: String, required: true },
})

const AirlineModel = model('airline', AirlineSchema, {
  modelKey: 'type',
  collectionName: 'airline',
  keyGeneratorDelimiter: '_',
})

module.exports = {
  AirlineModel,
}
