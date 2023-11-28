import express from "express";
import {
  createRoute,
  getRoute,
  updateRoute,
  deleteRoute,
  listRoutes,
} from "../controllers/routeController";

const router = express.Router();

router.post("/", createRoute);

router.get("/:id", getRoute);

router.put("/", updateRoute);

router.delete("/:id", deleteRoute);

router.get("/", listRoutes);

export default router;
