/**
 * Connects to the database.
 * this function checks if a connection already exists.
 * if not, it creates a new one and stores it in `pool` for reuse.
 * if there's an error, it stops the server.
 */

// ---- db connection ----
require("dotenv").config();
const sqlConfiguration = require("./db-config");
const sql = require("mssql");

let pool;

const connectToDB = async () => {
  try {
    if (!pool) {
      pool = new sql.ConnectionPool(sqlConfiguration);
      await pool.connect();
      console.log("Connected to SQL Server...");
    }
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectToDB;
