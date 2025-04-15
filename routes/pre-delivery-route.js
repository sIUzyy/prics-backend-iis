// ---- dependency ----
const express = require("express");
const router = express.Router();

// ---- middleware (file-upload) ----
const fileUpload = require("../middleware/file-upload");

// ---- controller ----
const preDeliveryController = require("../controllers/pre-delivery-controller");

// ---- route ----

// ---- create a pre-delivery
router.post(
  "/create-pre-delivery",
  fileUpload.array("image", 5), // up to 5 images
  preDeliveryController.createPreDelivery
);

// ---- get a list of pre-delivery by tracking number
router.get("/:tracking_no", preDeliveryController.getPreDeliveryByTrackingNo);

// ---- exports ----
module.exports = router;
