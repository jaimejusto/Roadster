const express = require("express");
const rootController = require("../controllers/root");

const router = express.Router();

router.route("/")
    .get(rootController.home)
;

module.exports = router;

