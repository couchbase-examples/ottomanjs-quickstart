import { model, Schema } from 'ottoman'

// Schedule sub-schema
const scheduleSchema = new Schema({
  day: { type: Number },
  flight: { type: String },
  utc: { type: String },
})

const RouteSchema = new Schema({
  airline: { type: String, required: true },
  airlineid: { type: String, required: true },
  sourceairport: { type: String, required: true },
  destinationairport: { type: String, required: true },
  stops: { type: Number, required: false },
  qquipment: { type: String, required: false },
  schedule: [scheduleSchema],
  distance: { type: Number, required: false },
})

const RouteModel = model('route', RouteSchema, {
  modelKey: 'type',
  collectionName: 'route',
  keyGeneratorDelimiter: '_',
})

module.exports = {
  RouteModel,
}
