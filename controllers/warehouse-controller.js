// ---- dependency ----
const sql = require("mssql");

// ---- model ----
const HttpError = require("../models/error/http-error");

// ---- controller ----

// http://localhost:8000/api/warehouse/create-warehouse - POST
const createWarehouse = async (req, res, next) => {
  // ---- request body (expected to get from end-user)
  const { warehouse_name, address } = req.body;

  if (!warehouse_name || !address) {
    return next(new HttpError("Warehouse name and address are required", 400));
  }

  try {
    const pool = await req.db; // get the database connection
    await pool
      .request()
      .input("warehouse_name", sql.NVarChar(100), warehouse_name)
      .input("address", sql.NVarChar(255), address)
      .execute("createWarehouse");

    res.status(201).json({ message: "Warehouse created successfully" });
  } catch (err) {
    console.error("Error creating warehouse:", err);
    const error = new HttpError(
      "Failed to create a warehouse. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/warehouse - GET
const getWarehouses = async (req, res, next) => {
  try {
    const pool = await req.db; // Get the database connection
    const result = await pool.request().execute("getWarehouses");

    res.status(200).json({ warehouses: result.recordset });
  } catch (err) {
    console.error("Error fetching warehouses:", err);
    const error = new HttpError(
      "Failed to retrieve warehouse list. Please try again later.",
      500
    );
    return next(error);
  }
};

// ---- exports ----
exports.createWarehouse = createWarehouse;
exports.getWarehouses = getWarehouses;
