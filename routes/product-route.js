// ---- dependency ----
const express = require("express");
const router = express.Router();

// ---- controller ----
const productController = require("../controllers/product-controller");

// ---- route ----

// ---- create an appointment
router.post("/create-product", productController.createProduct);

// ---- get a list of product
router.get("/:tracking_no", productController.getProductByTrackingNo);

// ---- exports ----
module.exports = router;
