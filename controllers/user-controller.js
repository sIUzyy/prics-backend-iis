// ---- dependency ----
const bcrypt = require("bcryptjs"); // ---- hashing the password
const sql = require("mssql");

// ---- model ----
const HttpError = require("../models/error/http-error");

// ---- controller ----

// http://localhost:8000/api/user/signup - POST
const signUp = async (req, res, next) => {
  const { username, name, role, password } = req.body;

  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 12);

    const pool = await req.db;
    await pool
      .request()
      .input("username", sql.NVarChar(255), username)
      .input("name", sql.NVarChar(255), name || null)
      .input("role", sql.NVarChar(10), role)
      .input("password", sql.NVarChar(255), hashedPassword) // store hashed password
      .execute("signUp");

    res.status(201).json({ message: "User signed up successfully" });
  } catch (err) {
    console.error("Error signing up:", err);
    const error = new HttpError(
      "Failed to create an account. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/user/signin - POST
const signIn = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const pool = await req.db;
    const result = await pool
      .request()
      .input("username", sql.NVarChar(255), username)
      .execute("signIn");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.recordset[0];

    // Compare hashed password with the plain text password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // remove password before sending response
    delete user.password;

    res.status(200).json({ message: "Sign-in successful", user });
  } catch (err) {
    console.error("Error signing in:", err);
    const error = new HttpError(
      "Failed to sign in. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/user/signin-as-driver - POST
const signInAsDriver = async (req, res, next) => {
  const { plate_no } = req.body;

  if (!plate_no) {
    return res.status(400).json({ message: "Plate number is required" });
  }

  try {
    const pool = await req.db;
    const result = await pool
      .request()
      .input("plate_no", sql.NVarChar(10), plate_no)
      .execute("SignInAsDriver");

    // If the first record contains an error message, deny access
    if (result.recordset.length > 0 && result.recordset[0].error_message) {
      return res
        .status(401)
        .json({ message: result.recordset[0].error_message });
    }

    // If no shipments exist but the truck is valid, return an empty shipments array
    return res.status(200).json({
      message: "Driver successfully signed in",
      shipments: result.recordset,
    });
  } catch (err) {
    console.error("Error signing in as driver:", err);
    return next(
      new HttpError("Failed to sign in as driver. Please try again later.", 500)
    );
  }
};

// http://localhost:8000/api/user/guard-role - GET
const getUserGuardRole = async (req, res, next) => {
  try {
    const pool = await req.db; // Get the database connection
    const result = await pool.request().execute("getUserGuardRole");

    res.status(200).json({
      message: "Guards role retrieved successfully",
      guards: result.recordset || [], // Return empty array if no records
    });
  } catch (err) {
    console.error("Error retrieving guards:", err);
    const error = new HttpError(
      "Failed to retrieve guards. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/user/:username/delete-user - DELETE
const deleteUserByUsername = async (req, res, next) => {
  const { username } = req.params; // Get username from request parameters
  const role = req.headers["role"] || req.headers["Role"];

  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only." });
  }

  try {
    const pool = await req.db;
    const result = await pool
      .request()
      .input("username", sql.NVarChar(255), username)
      .execute("deleteUserByUsername");

    res.status(200).json({ message: `User ${username} deleted successfully` });
  } catch (err) {
    console.error("Error deleting user:", err);
    const error = new HttpError(
      "Failed to delete user. Please try again later.",
      500
    );
    return next(error);
  }
};

// ---- exports ----
exports.signUp = signUp;
exports.signIn = signIn;
exports.signInAsDriver = signInAsDriver;
exports.getUserGuardRole = getUserGuardRole;
exports.deleteUserByUsername = deleteUserByUsername;
