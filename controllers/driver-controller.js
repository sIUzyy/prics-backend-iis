// ---- dependency ----
const sql = require("mssql");

// ---- model ----
const HttpError = require("../models/error/http-error");

// ---- controller ----

// http://localhost:8000/api/driver/create-driver - POST
const createDriver = async (req, res, next) => {
  // ---- request body (expected to get from end-user)
  const { driver_name, address, license_no } = req.body;

  if (!driver_name || !address || !license_no) {
    return next(new HttpError("All fields are required", 400));
  }

  try {
    const pool = await req.db; // get the database connection
    await pool
      .request()
      .input("driver_name", sql.NVarChar(100), driver_name)
      .input("address", sql.NVarChar(255), address)
      .input("license_no", sql.NVarChar(50), license_no)
      .execute("createDriver");

    res.status(201).json({ message: "Driver created successfully" });
  } catch (err) {
    console.error("Error creating driver:", err);
    const error = new HttpError(
      "Failed to create driver. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/driver - GET
const getDrivers = async (req, res, next) => {
  try {
    const pool = await req.db; // get the database connection
    const result = await pool.request().execute("getDrivers");

    res.status(200).json({ drivers: result.recordset }); // send retrieved data
  } catch (err) {
    console.error("Error fetching drivers:", err);
    const error = new HttpError(
      "Failed to retrieve driver list. Please try again later.",
      500
    );
    return next(error);
  }
};

// ---- exports ----
exports.createDriver = createDriver;
exports.getDrivers = getDrivers;
