import { db } from "../database/db.js";

const getSession = (phone) => {
  const stmt = db.prepare("SELECT * FROM sessions WHERE phone = ?");
  return stmt.get(phone);
};

const upsertSession = ({
  phone,
  city,
  property_type,
  purpose,
  budget,
  last_message_hash,
  last_message_id,
  last_message_at,
}) => {
  const stmt = db.prepare(`
    INSERT INTO sessions (phone, city, property_type, purpose, budget, last_message_hash, last_message_id, last_message_at, updated_at)
    VALUES (@phone, @city, @property_type, @purpose, @budget, @last_message_hash, @last_message_id, @last_message_at, @updated_at)
    ON CONFLICT(phone) DO UPDATE SET
      city = excluded.city,
      property_type = excluded.property_type,
      purpose = excluded.purpose,
      budget = excluded.budget,
      last_message_hash = excluded.last_message_hash,
      last_message_id = excluded.last_message_id,
      last_message_at = excluded.last_message_at,
      updated_at = excluded.updated_at
  `);

  stmt.run({
    phone,
    city: city || null,
    property_type: property_type || null,
    purpose: purpose || null,
    budget: budget || null,
    last_message_hash: last_message_hash || null,
    last_message_id: last_message_id || null,
    last_message_at: last_message_at || null,
    updated_at: new Date().toISOString(),
  });
};

export { getSession, upsertSession };
