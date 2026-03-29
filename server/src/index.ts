import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import db from "./db/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// verifica daca serverul ruleaza
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// verifica daca baza de date este conectata
app.get("/db-test", async (_req, res) => {
  const result = await db.query("SELECT NOW() AS ora_curenta");
  res.json({ ok: true, ora: result.rows[0].ora_curenta });
});

// restul rutelor vor fi jos...


app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server pornit pe portul ${config.port}`);
});
