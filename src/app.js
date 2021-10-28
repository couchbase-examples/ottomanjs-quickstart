import express from 'express'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import { ottoman, FindOptions } from '../db/ottomanConnection'
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

app.post('/profile', async (req, res) => {
  if (!req.body.email || !req.body.pass) {
    return res.status(400).send({ 'message': `${!req.body.email ? 'email ' : ''}${
      (!req.body.email && !req.body.pass) 
        ? 'and pass are required' : (req.body.email && !req.body.pass) 
          ? 'pass is required' : 'is required'
    }`})
  }

  await makeResponse(res, () => {
    res.status(200)
    const profile = new ProfileModel({
      ...req.body, pass: bcrypt.hashSync(req.body.pass, 10)
    })
    return profile.save()
  })
})

app.get('/profile/:pid', 
  async (req, res) => await makeResponse(res, () => 
    ProfileModel.findById(req.params.pid)
  )
)

app.put('/profile/:pid', 
  async (req, res) => {
    ProfileModel.findById(req.params.pid)
      .then(async (result) => {
        /* Create a New Document with new values, 
          if they are not passed from request, use existing values */
        const newDoc = {
          pid: result.pid,
          firstName: req.body.firstName ? req.body.firstName : result.firstName,
          lastName: req.body.lastName ? req.body.lastName : result.lastName,
          email: req.body.email ? req.body.email : result.email,
          pass: req.body.pass ? bcrypt.hashSync(req.body.pass, 10) : result.pass,
        }
        /* Persist updates with new doc */
        await makeResponse(res, () => {
          return ProfileModel.replaceById(req.params.pid, newDoc)
        })
      })
})

app.delete('/profile/:pid', 
  async (req, res) => await makeResponse(res, () => {
    ProfileModel.removeById(req.params.pid)
    res.status(204)
  })
)

app.get('/profiles', async (req, res) => {
  await makeResponse(res, async () => {
    const { limit, searchFirstName, skip } = req.query
    const options = new FindOptions({ 
      limit: Number(limit || 5), 
      skip: Number(skip || 0),
      searchFirstName: `%${searchFirstName}%`
    })
    const filter = (searchFirstName)
      ? { firstName: { $like: `%${searchFirstName}%`, $ignoreCase: true } }
      : {}
    const result = await ProfileModel.find(filter, options)
    const { rows: items } = result
    return { items }
  })
})

module.exports = { 
  app, ottoman
}
