import { db } from "../database/db.js";

const createLead = ({
  phone,
  city,
  property_type,
  purpose,
  budget,
  message,
}) => {
  const stmt = db.prepare(`
    INSERT INTO leads (phone, city, property_type, purpose, budget, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    phone,
    city,
    property_type,
    purpose,
    budget,
    message,
    new Date().toISOString(),
  );
};

const getLeads = () => {
  const stmt = db.prepare("SELECT * FROM leads ORDER BY created_at DESC");
  return stmt.all();
};

const getLeadStats = () => {
  const stmt = db.prepare("SELECT COUNT(*) as total FROM leads");
  return stmt.get();
};

export { createLead, getLeads, getLeadStats };
