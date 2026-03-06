import { Router } from "express";
import { getProperties } from "../services/matchingService.js";

const router = Router();

router.get("/api/properties", (req, res) => {
  const properties = getProperties();
  res.json({ data: properties });
});

export default router;
