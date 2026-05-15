import type { User } from "../../types/index.js";
import db from "../index.js";

export async function getUserById(id: string): Promise<User | null> {
  const result = await db.query("SELECT * FROM users WHERE user_id = $1", [id]);
  return result.rows[0] ?? null;
}

// ex: updateUser("1", {first_name: "prenume nou", last_name: "nume nou"})
export async function updateUser(
  id: string,
  data: Partial<User>,
): Promise<User> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

  const result = await db.query(
    `UPDATE users SET ${sets} WHERE user_id = $${keys.length + 1} RETURNING *`,
    [...values, id],
  );
  return result.rows[0];
}
