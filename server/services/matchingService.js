import { db } from "../database/db.js";

const matchProperties = ({ city, property_type, purpose, budget }) => {
  const stmt = db.prepare(`
    SELECT * FROM properties
    WHERE lower(city) = lower(?)
      AND lower(property_type) = lower(?)
    LIMIT 3
  `);

  const results = stmt.all(city, property_type);

  if (results.length > 0) return results;

  const fallback = db.prepare("SELECT * FROM properties LIMIT 3").all();
  return fallback;
};

const getProperties = () => {
  const stmt = db.prepare("SELECT * FROM properties ORDER BY id DESC");
  return stmt.all();
};

const getPropertyStats = () => {
  const stmt = db.prepare("SELECT COUNT(*) as total FROM properties");
  return stmt.get();
};

export { getProperties, getPropertyStats, matchProperties };

