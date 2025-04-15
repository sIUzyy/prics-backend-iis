/**
 * this file stores the database connection settings using environment variables.
 */

// ---- sql connection ----
const sqlConfiguration = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: process.env.DB_ENCRYPT === "true", // Convert string to boolean
    trustServerCertificate: true,
  },
};

console.log(process.env.DB_SERVER);

module.exports = sqlConfiguration;
