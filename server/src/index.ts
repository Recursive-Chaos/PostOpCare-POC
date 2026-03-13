import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// rute simple
app.get("/health", (_req, res) => {
  res.json({ success: true, data: "ok" });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server pornit pe portul ${config.port}`);
});

export default app;
