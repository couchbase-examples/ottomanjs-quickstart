import express from 'express'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import { ottoman } from '../db/connection'
import { ProfileModel } from './shared/profiles.model'
import { makeResponse } from './shared/makeResponse'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get('/', function (req, res) {
  res.send('<body onload="window.location = \'/swagger-ui/\'"><a href="/swagger-ui/">Click here to see the API</a>')
})

app.post("/profile", async (req, res) => {
  if (!req.body.email || !req.body.pass) {
    return res.status(400).send({ "message": `${!req.body.email ? 'email ' : ''}${
      (!req.body.email && !req.body.pass) 
        ? 'and pass are required' : (req.body.email && !req.body.pass) 
          ? 'pass is required' : 'is required'
    }`})
  }

  await makeResponse(res, () => {
    res.status(201)
    const profile = new ProfileModel({
      ...req.body, pass: bcrypt.hashSync(req.body.pass, 10)
    })
    return profile.save()
  })
})

module.exports = { 
  app, ottoman
}
