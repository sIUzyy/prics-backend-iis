// ---- dependency ----
const express = require("express");
const router = express.Router();

// ---- controller ----
const truckController = require("../controllers/truck-controller");

// ---- route ----

// ---- create a truck
router.post("/create-truck", truckController.createTruck);

// ---- get a list of truck
router.get("/", truckController.getTrucks);

// ---- exports ----
module.exports = router;
