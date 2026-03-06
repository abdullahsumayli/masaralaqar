import { Router } from "express";
import { getLeads } from "../services/leadService.js";

const router = Router();

router.get("/api/leads", (req, res) => {
  const leads = getLeads();
  res.json({ data: leads });
});

export default router;
