import { makeResponse } from "../shared/makeResponse";
import { AirlineModel } from "../models/airlineModel";
import { Query, ottoman } from "../../db/ottomanConnection.js";

const createAirline = async (req, res) => {
  try {
    // Try to find an existing document with the given ID
    const existingAirline = await AirlineModel.findById(req.body.id);

    if (existingAirline) {
      // Document with the same id already exists
      return res.status(409).json({ message: "Duplicate key error" });
    }
  } catch (error) {
    // Ignore the error (i.e document with key not found, proceed to create)
  }
  await makeResponse(res, async () => {
    const airline = new AirlineModel(req.body);
    await airline.save();
    res.status(201);
    return airline;
  });
};

const getAirline = async (req, res) => {
  await makeResponse(res, async () => {
    const airline = await AirlineModel.findById(req.params.id);
    return airline;
  });
};

const updateAirline = async (req, res) => {
  await makeResponse(res, async () => {
    const airline = AirlineModel.replaceById(req.body.id, req.body);
    return airline;
  });
};

const deleteAirline = async (req, res) => {
  await makeResponse(res, async () => {
    await AirlineModel.removeById(req.params.id);
    res.status(204);
  });
};

const listAirlines = async (req, res) => {
  const country = req.query.country || "";
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;
  let filter = {};
  if (country) {
    filter.country = country;
  }

  const options = { limit: limit, offset: offset };
  await makeResponse(res, async () => {
    const airlines = await AirlineModel.find(filter, options);
    return airlines.rows;
  });
};

const getAirlinesToAirport = async (req, res) => {
  const airport = req.query.airport;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;

  // Subquery to get distinct airline IDs
  const subquery = new Query({}, "travel-sample.inventory.route")
    .select([{ $field: "DISTINCT META(airline).id AS airlineId" }])
    .plainJoin(
      "JOIN `travel-sample`.inventory.airline ON route.airlineid = META(airline).id",
    )
    .where({ "route.destinationairport": { $eq: airport } });

  // Main query to join with the subquery
  const mainQuery = new Query({}, "travel-sample.inventory.airline AS air")
    .select([
      { $field: "air.callsign" },
      { $field: "air.country" },
      { $field: "air.iata" },
      { $field: "air.icao" },
      { $field: "air.name" },
    ])
    .plainJoin(
      `JOIN (${subquery.build()}) AS subquery ON META(air).id = subquery.airlineId`,
    )
    .orderBy({ "air.name": "ASC" })
    .limit(limit)
    .offset(offset);
  console.log(mainQuery.build());
  await makeResponse(res, async () => {
    const result = await ottoman.query(mainQuery.build());
    return result.rows;
  });
};

export {
  createAirline,
  getAirline,
  updateAirline,
  deleteAirline,
  listAirlines,
  getAirlinesToAirport,
};
