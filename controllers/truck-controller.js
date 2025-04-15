// ---- dependency ----
const sql = require("mssql");

// ---- model ----
const HttpError = require("../models/error/http-error");

// ---- controller ----

// http://localhost:8000/api/truck/create-truck - POST
const createTruck = async (req, res, next) => {
  // ---- request body (expected to get from end-user)
  const { truck_model, plate_no } = req.body;

  if (!truck_model || !plate_no) {
    return next(
      new HttpError("Truck model and plate number are required", 400)
    );
  }

  try {
    const pool = await req.db; // get the database connection
    await pool
      .request()
      .input("truck_model", sql.NVarChar(50), truck_model)
      .input("plate_no", sql.NVarChar(10), plate_no)
      .execute("createTruck");

    res.status(201).json({ message: "Truck created successfully" });
  } catch (err) {
    console.error("Error creating truck:", err);

    // Handle duplicate plate number error
    if (err.number === 50001) {
      return res
        .status(400)
        .json({ message: "Truck with this plate number already exists." });
    }

    const error = new HttpError(
      "Failed to create a truck. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/truck - GET
const getTrucks = async (req, res, next) => {
  try {
    const pool = await req.db; // get the database connection
    const result = await pool.request().execute("getTrucks");

    res.status(200).json({ trucks: result.recordset });
  } catch (err) {
    console.error("Error fetching trucks:", err);

    const error = new HttpError(
      "Failed to retrieve truck list. Please try again later.",
      500
    );
    return next(error);
  }
};

// ---- exports ----
exports.createTruck = createTruck;
exports.getTrucks = getTrucks;
