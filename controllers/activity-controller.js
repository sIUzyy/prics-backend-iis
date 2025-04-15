// ---- dependency ----
const sql = require("mssql");

// ---- model ----
const HttpError = require("../models/error/http-error");

// ---- controller ----

// http://localhost:8000/api/activity/create-activity - POST
const createActivity = async (req, res, next) => {
  // ---- request body (expected to get from end-user)
  const { activity_name, description } = req.body;

  if (!activity_name) {
    return next(new HttpError("Activity name is required", 400));
  }

  try {
    const pool = await req.db; // get database connection
    const result = await pool
      .request()
      .input("activity_name", sql.NVarChar(30), activity_name)
      .input("description", sql.NVarChar(100), description || null)
      .execute("createActivity");

    const newActivityId = result.recordset[0]?.new_activity_id; // get the auto-generated ID

    res.status(201).json({
      message: "Activity created successfully",
      activity_id: newActivityId,
    });
  } catch (err) {
    console.error("Error creating activity:", err);
    const error = new HttpError(
      "Failed to create an activity. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/activity - GET
const getActivities = async (req, res, next) => {
  try {
    const pool = await req.db; // get the database connection from middleware
    const result = await pool.request().execute("getActivities");

    res.status(200).json({ activities: result.recordset }); // send retrieved data
  } catch (err) {
    console.error("Error fetching activities:", err);
    const error = new HttpError(
      "Failed to retrieve activity list. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/activity/:id/update-activity - PATCH
const updateActivityById = async (req, res, next) => {
  // ---- extract id
  const activity_id = req.params.id;
  const role = req.headers["role"] || req.headers["Role"];

  // ---- request body (expected to get from end-user)
  const { activity_name, description } = req.body;

  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only." });
  }

  if (!activity_name) {
    return next(new HttpError("Activity name are required", 400));
  }

  try {
    const pool = await req.db; // get the database connection
    const result = await pool
      .request()
      .input("activity_id", sql.Int, activity_id)
      .input("activity_name", sql.NVarChar(30), activity_name)
      .input("description", sql.NVarChar(100), description || null)
      .execute("updateActivityById");

    res.status(200).json({
      message: "Activity updated successfully",
      updatedActivity: result.recordset[0],
    });
  } catch (err) {
    console.error("Error updating activity:", err);
    const error = new HttpError(
      "Failed to update activity. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/activity/:id/delete-activity - DELETE
const deleteActivityById = async (req, res, next) => {
  // ---- extract id
  const activity_id = req.params.id;
  const role = req.headers["role"] || req.headers["Role"];

  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only." });
  }

  try {
    const pool = await req.db; // get the database connection
    await pool
      .request()
      .input("activity_id", sql.Int, activity_id)
      .execute("deleteActivityById");

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (err) {
    console.error("Error deleting activity:", err);
    const error = new HttpError(
      "Failed to delete activity. Please try again later.",
      500
    );
    return next(error);
  }
};

// ---- exports ----
exports.createActivity = createActivity;
exports.getActivities = getActivities;
exports.updateActivityById = updateActivityById;
exports.deleteActivityById = deleteActivityById;
