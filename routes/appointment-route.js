// ---- dependency ----
const express = require("express");
const router = express.Router();

// ---- controller ----
const apptController = require("../controllers/appointment-controller");

// ---- route ----

// ---- create an appointment
router.post("/create-appointment", apptController.createAppointment);

// ---- get a list of appointment
router.get("/", apptController.getAppointments);

// ---- get the appointment by id
router.get("/:appointment_id/gate-pass", apptController.getAppointmentByApptId);

// ---- get the appointment by plate_no
router.get("/:plate_no/driver", apptController.getAppointmentByPlateNo);

// ---- update the appointment
router.post(
  "/:appointment_id/update-appointment",
  apptController.updateAppointmentByApptId
);

// ---- update appointment's time-in
router.post(
  "/:appointment_id/gate-pass/time-in",
  apptController.updateTimeInByApptId
);

// ---- update appointment's time-out
router.post(
  "/:appointment_id/gate-pass/time-out",
  apptController.updateTimeOutByApptId
);

// ---- delete the appointment
router.post(
  "/:appointment_id/delete-appointment",
  apptController.deleteAppointmentByApptId
);

// ---- exports ----
module.exports = router;
