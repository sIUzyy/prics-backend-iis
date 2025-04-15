// ---- dependency ----
const sql = require("mssql");

// ---- model ----
const HttpError = require("../models/error/http-error");

// ---- controller ----

// http://localhost:8000/api/shipment/create-shipment - POST
const createShipment = async (req, res, next) => {
  const {
    tracking_no,
    customer_name,
    address,
    load_no,
    uom,
    shipped_date,
    waybill_no,
    cv_no,
    plate_no,
    driver_name,
    status,
    epod_status,
    priority,
  } = req.body;

  try {
    const pool = await req.db; // Get the database connection

    // Execute stored procedure
    await pool
      .request()
      .input("tracking_no", sql.NVarChar(20), tracking_no)
      .input("customer_name", sql.NVarChar(100), customer_name)
      .input("address", sql.NVarChar(255), address)
      .input("load_no", sql.NVarChar(20), load_no)
      .input("uom", sql.NVarChar(20), uom)
      .input("shipped_date", sql.DateTime, shipped_date)
      .input("waybill_no", sql.NVarChar(20), waybill_no)
      .input("cv_no", sql.NVarChar(20), cv_no)
      .input("plate_no", sql.NVarChar(10), plate_no)
      .input("driver_name", sql.NVarChar(100), driver_name)
      .input("status", sql.NVarChar(50), status)
      .input("epod_status", sql.NVarChar(50), epod_status)
      .input("priority", sql.Int, priority || null)
      .input("createdAt", sql.DateTime, new Date()) // Set current timestamp
      .execute("createShipment"); // Call stored procedure

    res.status(201).json({ message: "Shipment created successfully" });
  } catch (err) {
    console.error("Error creating shipment:", err);
    return next(
      new HttpError("Failed to create shipment, please try again.", 500)
    );
  }
};

// http://localhost:8000/api/shipment/ - GET
const getShipments = async (req, res, next) => {
  try {
    const pool = await req.db; // Get DB connection

    // Fetch shipments with total_cbm already included
    const result = await pool.request().execute("getShipments");

    res.status(200).json({ shipments: result.recordset });
  } catch (err) {
    console.error("Error fetching shipments:", err);
    return next(
      new HttpError("Failed to fetch shipments, please try again.", 500)
    );
  }
};

// http://localhost:8000/api/shipment/pre-delivery/:tracking_no/driver - GET
const getShipmentByTrackingNo = async (req, res, next) => {
  const { tracking_no } = req.params;

  try {
    const pool = await req.db; // Get DB connection

    // Execute stored procedure
    const result = await pool
      .request()
      .input("tracking_no", sql.NVarChar(20), tracking_no)
      .execute("getShipmentByTrackingNo");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.status(200).json({ shipment: result.recordset[0] });
  } catch (err) {
    console.error("Error fetching shipment:", err);
    return next(
      new HttpError("Failed to fetch shipment, please try again.", 500)
    );
  }
};

// http://localhost:8000/api/shipment/:plate_no/driver - GET
const getShipmentByPlateNo = async (req, res, next) => {
  const { plate_no } = req.params;

  try {
    const pool = await req.db; // Get DB connection

    // Execute stored procedure
    const result = await pool
      .request()
      .input("plate_no", sql.NVarChar(10), plate_no)
      .execute("getShipmentByPlateNo");

    // Return empty array instead of a 404 error
    res.status(200).json({
      message: "Shipments retrieved successfully",
      shipments: result.recordset || [],
    });
  } catch (err) {
    console.error("Error fetching shipments:", err);
    return next(
      new HttpError("Failed to fetch shipments, please try again.", 500)
    );
  }
};

// http://localhost:8000/api/shipment/:tracking_no/update-epod-status - PATCH
const updateShipmentEpodStatusByTrackingNo = async (req, res, next) => {
  const { tracking_no } = req.params;
  const { epod_status } = req.body;
  const role = req.headers["role"] || req.headers["Role"];

  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only." });
  }

  if (!epod_status) {
    return res.status(400).json({ message: "ePOD status is required" });
  }

  try {
    const pool = await req.db; // Get DB connection

    // Execute stored procedure
    const result = await pool
      .request()
      .input("tracking_no", sql.NVarChar(20), tracking_no)
      .input("epod_status", sql.NVarChar(50), epod_status)
      .execute("updateShipmentEpodStatusByTrackingNo");

    res.status(200).json({ message: "ePOD status updated successfully" });
  } catch (err) {
    console.error("Error updating ePOD status:", err);
    return next(
      new HttpError("Failed to update ePOD status, please try again.", 500)
    );
  }
};

// http://localhost:8000/api/shipment/:tracking_no/update-priority - PATCH
const updateShipmentPriorityByTrackingNo = async (req, res, next) => {
  const { tracking_no } = req.params;
  const { priority } = req.body;
  const role = req.headers["role"] || req.headers["Role"];

  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only." });
  }

  if (priority === undefined || priority === null) {
    return res.status(400).json({ message: "Priority value is required" });
  }

  try {
    const pool = await req.db; // Get DB connection

    // Execute stored procedure
    const result = await pool
      .request()
      .input("tracking_no", sql.NVarChar(20), tracking_no)
      .input("priority", sql.Int, priority)
      .execute("updateShipmentPriorityByTrackingNo");

    res.status(200).json({ message: "Shipment priority updated successfully" });
  } catch (err) {
    console.error("Error updating shipment priority:", err);
    return next(
      new HttpError(
        "Failed to update shipment priority, please try again.",
        500
      )
    );
  }
};

// http://localhost:8000/api/shipment/:tracking_no/delete-shipment - DELETE
const deleteShipmentByTrackingNo = async (req, res, next) => {
  const { tracking_no } = req.params;
  const role = req.headers["role"] || req.headers["Role"];

  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only." });
  }

  try {
    const pool = await req.db; // Get DB connection

    // Execute stored procedure
    const result = await pool
      .request()
      .input("tracking_no", sql.NVarChar(20), tracking_no)
      .execute("deleteShipmentByTrackingNo");

    res.status(200).json({ message: "Shipment deleted successfully" });
  } catch (err) {
    console.error("Error deleting shipment:", err);
    return next(
      new HttpError("Failed to delete shipment, please try again.", 500)
    );
  }
};

// ---- exports ----
exports.createShipment = createShipment;
exports.getShipments = getShipments;
exports.getShipmentByTrackingNo = getShipmentByTrackingNo;
exports.getShipmentByPlateNo = getShipmentByPlateNo;
exports.updateShipmentEpodStatusByTrackingNo =
  updateShipmentEpodStatusByTrackingNo;
exports.updateShipmentPriorityByTrackingNo = updateShipmentPriorityByTrackingNo;
exports.deleteShipmentByTrackingNo = deleteShipmentByTrackingNo;
