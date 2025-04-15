// ---- dependency ----
const express = require("express");
const router = express.Router();

// ---- controller ----
const userController = require("../controllers/user-controller");

// ---- route ----

// ---- create an account
router.post("/signup", userController.signUp);

// ---- sign in as admin or security
router.post("/signin", userController.signIn);

// ---- sign in as driver
router.post("/signin-as-driver", userController.signInAsDriver);

// ---- get users by its role (guard)
router.get("/guard-role", userController.getUserGuardRole);

// ---- delete user by its username
router.post("/:username/delete-user", userController.deleteUserByUsername);

// ---- exports ----
module.exports = router;
