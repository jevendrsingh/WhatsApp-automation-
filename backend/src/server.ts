import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import routes from "./routes";
import { apiLimiter } from "./middleware/security";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(apiLimiter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", routes);

app.listen(config.port, () => {
  console.log(`AgentChat API running on :${config.port}`);
});
