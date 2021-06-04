const express = require("express");
const weatherAdviceController = require("../controllers/weatherAdvice");

const router = express.Router();

router.route("/:temp")
    .get(weatherAdviceController.home)
;

module.exports = router;