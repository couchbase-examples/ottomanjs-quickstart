import { makeResponse } from "../shared/makeResponse";
import { AirportModel } from "../models/airportModel";
import { Query, ottoman } from "../../db/ottomanConnection.js";

const createAirport = async (req, res) => {
  try {
    // Try to find an existing document with the given ID
    const existingAirport = await AirportModel.findById(req.body.id);

    if (existingAirport) {
      // Document with the same id already exists
      return res.status(409).json({ message: "Duplicate key error" });
    }
  } catch (error) {
    // Handle the error (document not found) or log it if needed
  }
  await makeResponse(res, async () => {
    const airport = new AirportModel(req.body);
    await airport.save();
    res.status(201);
    return airport;
  });
};

const getAirport = async (req, res) => {
  await makeResponse(res, async () => {
    const airport = await AirportModel.findById(req.params.id);
    return airport;
  });
};

const updateAirport = async (req, res) => {
  await makeResponse(res, async () => {
    const airport = AirportModel.replaceById(req.body.id, req.body);
    return airport;
  });
};

const deleteAirport = async (req, res) => {
  await makeResponse(res, async () => {
    await AirportModel.removeById(req.params.id);
    res.status(204);
  });
};

const listAirports = async (req, res) => {
  const country = req.query.country || "";
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;
  let filter = {};
  if (country) {
    filter.country = country;
  }

  const options = { limit: limit, offset: offset };
  await makeResponse(res, async () => {
    const airports = await AirportModel.find(filter, options);
    return airports.rows;
  });
};

const getDirectConnections = async (req, res) => {
  const airport = req.query.airport;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;
  // Subquery to get distinct airline IDs
  const subquery = new Query({}, "travel-sample.inventory.route")
    .select([{ $field: "DISTINCT route.destinationairport" }])
    .plainJoin(
      "JOIN `travel-sample`.inventory.airport AS airport ON route.sourceairport = airport.faa",
    )
    .where({
      "airport.faa": { $eq: airport },
      "route.stops": { $eq: 0 },
    })
    .orderBy({ "route.destinationairport": "ASC" })
    .limit(limit)
    .offset(offset);

  console.log(subquery.build());
  await makeResponse(res, async () => {
    const result = await ottoman.query(subquery.build());
    return result.rows;
  });
};

export {
  createAirport,
  getAirport,
  updateAirport,
  deleteAirport,
  listAirports,
  getDirectConnections,
};
