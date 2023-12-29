import { makeResponse } from '../shared/makeResponse'
import { RouteModel } from '../models/routeModel'

const createRoute = async (req, res) => {
  try {
    // Try to find an existing document with the given ID
    const existingRoute = await RouteModel.findById(req.body.id)

    if (existingRoute) {
      // Document with the same id already exists
      return res.status(409).json({ message: 'Duplicate key error' })
    }
  } catch (error) {
    // Handle the error (document not found) or log it if needed
  }
  await makeResponse(res, async () => {
    const route = new RouteModel(req.body)
    await route.save()
    res.status(201)
    return route
  })
}

const getRoute = async (req, res) => {
  await makeResponse(res, async () => {
    const route = await RouteModel.findById(req.params.id)
    return route
  })
}

const updateRoute = async (req, res) => {
  await makeResponse(res, async () => {
    const route = RouteModel.replaceById(req.body.id, req.body)
    return route
  })
}

const deleteRoute = async (req, res) => {
  await makeResponse(res, async () => {
    await RouteModel.removeById(req.params.id)
    res.status(204)
  })
}

const listRoutes = async (req, res) => {
  await makeResponse(res, async () => {
    const routes = await RouteModel.find({})
    return { items: routes }
  })
}

export { createRoute, getRoute, updateRoute, deleteRoute, listRoutes }
