const express = require("express");
const router = express.Router();

const ambulanceService = require("../public-services/ambulance");
const firefighterService = require("../public-services/firefighter");
const policeService = require("../public-services/police");

router.post("/ambulance/nearby", ambulanceService.nearby);
router.post("/firefighter/nearby", firefighterService.nearby);
router.post("/police/nearby", policeService.nearby);

const apiTest = require("../utils/apiTest");

router.get("/test/db", apiTest.dbTest);
router.get("/test/routes-api", apiTest.routesApiTest);

module.exports = router;
