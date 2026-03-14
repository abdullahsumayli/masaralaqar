import cors from "cors";
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { init } from "./database/db.js";
import leadsRoutes from "./routes/leads.js";
import propertiesRoutes from "./routes/properties.js";
import statsRoutes from "./routes/stats.js";
import webhookRoutes from "./routes/webhook.js";
import { httpLogger, logger } from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

init();

const app = express();

const origins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({ origin: origins.length ? origins : "*", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(httpLogger);

// Dashboard static files
app.use("/dashboard", express.static(path.join(__dirname, "dashboard")));

app.get("/health", (req, res) => {
  res.json({ ok: true, name: "Masar AI Server" });
});

app.use(webhookRoutes);
app.use(propertiesRoutes);
app.use(leadsRoutes);
app.use(statsRoutes);

app.use((err, req, res, next) => {
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ ok: false });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  logger.info(`Masar AI server running on port ${port}`);
});
