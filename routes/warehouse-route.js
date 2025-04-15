// ---- dependency ----
const express = require("express");
const router = express.Router();

// ---- controller ----
const warehouseController = require("../controllers/warehouse-controller");

// ---- route ----

// ---- create a warehouse
router.post("/create-warehouse", warehouseController.createWarehouse);

// ---- get a list of warehouse
router.get("/", warehouseController.getWarehouses);

// ---- exports ----
module.exports = router;
