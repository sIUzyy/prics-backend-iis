// ---- dependency ----
const sql = require("mssql");

// ---- model ----
const HttpError = require("../models/error/http-error");

// ---- controller ----

// http://localhost:8000/api/product/create-product - POST
const createProduct = async (req, res, next) => {
  const {
    product_code,
    tracking_no,
    description,
    shipped_qty,
    total_cbm_per_item,
  } = req.body;

  try {
    const pool = await req.db; // Get DB connection

    // Execute stored procedure
    const result = await pool
      .request()
      .input("product_code", sql.NVarChar(50), product_code)
      .input("tracking_no", sql.NVarChar(20), tracking_no)
      .input("description", sql.NVarChar(200), description)
      .input("shipped_qty", sql.Int, shipped_qty)
      .input("total_cbm_per_item", sql.Float, total_cbm_per_item)
      .execute("createProduct");

    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    console.error("Error creating product:", err);
    return next(
      new HttpError("Failed to create product, please try again.", 500)
    );
  }
};

// http://localhost:8000/api/product/:tracking_no - GET
const getProductByTrackingNo = async (req, res, next) => {
  const { tracking_no } = req.params;

  try {
    const pool = await req.db; // Get DB connection

    // Execute stored procedure
    const result = await pool
      .request()
      .input("tracking_no", sql.NVarChar(20), tracking_no)
      .execute("getProductByTrackingNo");

    // Return empty array if no products found
    res.status(200).json(result.recordset || []);
  } catch (err) {
    console.error("Error fetching products:", err);
    return next(
      new HttpError("Failed to fetch products, please try again.", 500)
    );
  }
};

// ---- exports ----
exports.createProduct = createProduct;
exports.getProductByTrackingNo = getProductByTrackingNo;
