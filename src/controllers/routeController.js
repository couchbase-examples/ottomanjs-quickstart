import { makeResponse } from '../shared/makeResponse'
import { makeCrudController } from '../shared/crudController'
import { RouteModel } from '../models/routeModel'

const {
  create: createRoute,
  read: getRoute,
  update: updateRoute,
  remove: deleteRoute,
} = makeCrudController(RouteModel)

const listRoutes = async (req, res) => {
  await makeResponse(res, async () => {
    const routes = await RouteModel.find({})
    return { items: routes }
  })
}

export { createRoute, getRoute, updateRoute, deleteRoute, listRoutes }
