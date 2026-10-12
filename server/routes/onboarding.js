const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const { savePreferences } = require("../controllers/onboardingController");

router.post("/", requireAuth, savePreferences);

module.exports = router;
