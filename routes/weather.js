const express = require("express");
const weatherController = require("../controllers/weather");

const router = express.Router();

router.route("/:lat_lon")
    .get(weatherController.home)
;

module.exports = router;

