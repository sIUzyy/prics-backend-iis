// ---- dependency ----
const express = require("express");
const router = express.Router();

// ---- controller ----
const shipmentController = require("../controllers/shipment-controller");

// ---- route ----

// ---- create a shipment
router.post("/create-shipment", shipmentController.createShipment);

// ---- get a list of shipment
router.get("/", shipmentController.getShipments);

// ---- get a shipment by tracking_no
router.get(
  "/pre-delivery/:tracking_no/driver",
  shipmentController.getShipmentByTrackingNo
);

// ---- get a shipment by plate_no
router.get("/:plate_no/driver", shipmentController.getShipmentByPlateNo);

// ---- update shipment's epod status
router.post(
  "/:tracking_no/update-epod-status",
  shipmentController.updateShipmentEpodStatusByTrackingNo
);

// ---- update shipment's priority
router.post(
  "/:tracking_no/update-priority",
  shipmentController.updateShipmentPriorityByTrackingNo
);

// ---- delete shipment by tracking_no
router.post(
  "/:tracking_no/delete-shipment",
  shipmentController.deleteShipmentByTrackingNo
);

// ---- exports ----
module.exports = router;
