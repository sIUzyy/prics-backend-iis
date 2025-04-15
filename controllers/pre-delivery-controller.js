// ---- dependency ----
const sql = require("mssql");

// ---- model ----
const HttpError = require("../models/error/http-error");

// ---- controller ----

// http://localhost:8000/api/pre-delivery/create-pre-delivery - POST
const createPreDelivery = async (req, res, next) => {
  const {
    tracking_no,
    load_no,
    received_date,
    received_by,
    product_code,
    received_qty,
    uom,
    remarks,
  } = req.body;

  try {
    const pool = await req.db;

    // Extract uploaded images (comma-separated) or use an empty string
    const uploadedImages = req.files?.length
      ? req.files.map((file) => file.path).join(",")
      : "";

    await pool
      .request()
      .input("tracking_no", sql.NVarChar, tracking_no)
      .input("load_no", sql.NVarChar, load_no)
      .input("received_date", sql.DateTime, received_date)
      .input("received_by", sql.NVarChar, received_by)
      .input("product_code", sql.NVarChar, product_code)
      .input("received_qty", sql.Int, parseInt(received_qty, 10) || 0)
      .input("uom", sql.NVarChar, uom)
      .input("remarks", sql.NVarChar, remarks)
      .input("uploaded_images", sql.NVarChar, uploadedImages)
      .execute("createPreDelivery");

    res.status(201).json({ message: "Pre-Delivery created successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Database error while creating pre-delivery" });
  }
};

// http://localhost:8000/api/pre-delivery/:tracking_no - GET
const getPreDeliveryByTrackingNo = async (req, res, next) => {
  const { tracking_no } = req.params;

  try {
    const pool = await req.db;

    const result = await pool
      .request()
      .input("tracking_no", sql.NVarChar, tracking_no)
      .execute("getPreDelivery");

    const preDelivery = result.recordsets?.[0] || []; // First result set
    const products = result.recordsets?.[1] || []; // Second result set
    const images = result.recordsets?.[2] || []; // Third result set

    if (!preDelivery.length) {
      return res.status(200).json([]);
    }

    // Attach images to the corresponding products
    products.forEach((product) => {
      product.uploadedImages = images
        .filter((img) => img.product_id === product.product_id)
        .map((img) => img.uploaded_image); // Convert to array of image paths
    });

    preDelivery[0].products = products;

    res.status(200).json(preDelivery[0]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Database error while retrieving pre-delivery data" });
  }
};

// ---- exports ----
exports.createPreDelivery = createPreDelivery;
exports.getPreDeliveryByTrackingNo = getPreDeliveryByTrackingNo;
