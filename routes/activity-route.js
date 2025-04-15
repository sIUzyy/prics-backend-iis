// ---- dependency ----
const express = require("express");
const router = express.Router();

// ---- controller ----
const activityController = require("../controllers/activity-controller");

// ---- route ----

// ---- create an activity
router.post("/create-activity", activityController.createActivity);

// ---- get a list of activities
router.get("/", activityController.getActivities);

// ---- update an activity
router.post("/:id/update-activity", activityController.updateActivityById);

// ---- delete an activity
router.post("/:id/delete-activity", activityController.deleteActivityById);

// ---- exports ----
module.exports = router;
