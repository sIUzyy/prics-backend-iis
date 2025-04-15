/*
 * Database Middleware
 * this middleware ensures a database connection is available for each request.
 * it uses a shared database connection established via connectToDB and attaches it to the req object for use in subsequent middleware and route handlers.
 */

// ---- configuration ----
const connectToDB = require("../configuration/db-connect");

const dbMiddleware = async (req, res, next) => {
  try {
    if (!req.db) {
      req.db = await connectToDB();
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
};

module.exports = dbMiddleware;
