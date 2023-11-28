import express from "express";
import {
  createAirport,
  getAirport,
  updateAirport,
  deleteAirport,
  listAirports,
  getDirectConnections,
} from "../controllers/airportController";

const router = express.Router();

router.get("/list", listAirports);

router.get("/direct-connections", getDirectConnections);

router.post("/", createAirport);

router.get("/:id", getAirport);

router.put("/", updateAirport);

router.delete("/:id", deleteAirport);

export default router;
