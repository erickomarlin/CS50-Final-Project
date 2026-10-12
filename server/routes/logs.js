const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const {
  addFood,
  addActivity,
  getRecap,
  getResult,
  clearFood,
  clearActivity,
} = require("../controllers/logsController");

router.post("/food", requireAuth, addFood);
router.delete("/food", requireAuth, clearFood);
router.post("/activity", requireAuth, addActivity);
router.delete("/activity", requireAuth, clearActivity);
router.get("/recap", requireAuth, getRecap);
router.get("/result", requireAuth, getResult);

module.exports = router;
