// ---- dependency ----
const express = require("express");
const router = express.Router();

// ---- controller ----
const driverController = require("../controllers/driver-controller");

// ---- route ----

// ---- create a driver
router.post("/create-driver", driverController.createDriver);

// ---- get a list of driver
router.get("/", driverController.getDrivers);

// ---- exports ----
module.exports = router;
