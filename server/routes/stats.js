import { Router } from "express";
import { db } from "../database/db.js";
import { getLeadStats } from "../services/leadService.js";
import { getPropertyStats } from "../services/matchingService.js";

const router = Router();

router.get("/api/stats", (req, res) => {
  const leads = getLeadStats();
  const properties = getPropertyStats();
  const sessions = db.prepare("SELECT COUNT(*) as total FROM sessions").get();

  res.json({
    data: {
      leads: leads.total || 0,
      properties: properties.total || 0,
      sessions: sessions.total || 0,
    },
  });
});

export default router;
