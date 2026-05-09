import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// conexiunea la baza de date, credentialele sunt in .env
const db = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }, // in prod nu ar trebui sa facem asta
});

db.connect()
  .then(() => console.log("conectat la baza de date!"))
  .catch((err) => console.error("eroare la conectare:", err.message));

export default db;

// cum se foloseste:
// const result = await db.query("SELECT * FROM utilizatori");
// const result = await db.query("SELECT * FROM utilizatori WHERE id = $1", [id]);
// await db.query("INSERT INTO utilizatori (nume, email) VALUES ($1, $2)", [nume, email]);
// await db.query("DELETE FROM utilizatori WHERE id = $1", [id]);
// foloseste $1 $2 etc in loc sa pui valorile direct in query


// sau puteti crea functii speciale gen
// const addUser(user){...} care folosesc db.query
