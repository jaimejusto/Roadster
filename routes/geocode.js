const express = require("express");
const geocodeController = require("../controllers/geocode");

const router = express.Router();

router.route("/:lat_lon")
    .get(geocodeController.home)
;

module.exports = router;