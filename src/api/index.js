const express = require("express");
const router = express.Router();

const ambulanceService = require("../services/ambulance.service");
const firefighterService = require("../services/firefighter.service");
const policeService = require("../services/police.service");

router.post("/ambulance/nearby", ambulanceService.nearby);
router.post("/firefighter/nearby", firefighterService.nearby);
router.post("/police/nearby", policeService.nearby);

module.exports = router;
