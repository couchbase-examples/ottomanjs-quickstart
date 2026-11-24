import { makeResponse } from './makeResponse'

/**
 * Builds the key/value CRUD handlers shared by every collection in this
 * quickstart (airline, airport, route). Each controller passes its Ottoman
 * model and keeps only its collection-specific queries.
 *
 * - create: 409 if a document with `req.body.id` already exists, else 201
 * - read:   findById(`req.params.id`)
 * - update: replaceById(`req.body.id`, `req.body`)
 * - remove: removeById(`req.params.id`), 204
 *
 * Errors are mapped to HTTP status codes by `makeResponse`.
 */
const makeCrudController = (Model) => {
  const create = async (req, res) => {
    try {
      const existing = await Model.findById(req.body.id)
      if (existing) {
        return res.status(409).json({ message: 'Duplicate key error' })
      }
    } catch (error) {
      // findById throws when the key is not found: proceed to create
    }
    await makeResponse(res, async () => {
      const document = new Model(req.body)
      await document.save()
      res.status(201)
      return document
    })
  }

  const read = async (req, res) => {
    await makeResponse(res, () => Model.findById(req.params.id))
  }

  const update = async (req, res) => {
    await makeResponse(res, () => Model.replaceById(req.body.id, req.body))
  }

  const remove = async (req, res) => {
    await makeResponse(res, async () => {
      await Model.removeById(req.params.id)
      res.status(204)
    })
  }

  return { create, read, update, remove }
}

export { makeCrudController }
