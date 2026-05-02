import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import db from "./db/index.js";
import authRouter from "./routes/auth/index.js";
import doctorPatientsRouter from "./routes/doctor/patients.js";
import doctorQuestionnairesRouter from "./routes/doctor/questionnaires.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// health
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// check DB
app.get("/db-test", async (_req, res) => {
  const result = await db.query("SELECT NOW() AS current_time");
  res.json({ ok: true, time: result.rows[0].current_time });
});

// rutare auth
app.use("/auth", authRouter);
app.use("/doctor/patients", doctorPatientsRouter);
app.use("/doctor/questionnaires", doctorQuestionnairesRouter);


app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server pornit pe portul ${config.port}`);
});
