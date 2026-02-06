const express = require("express");
const router = express.Router();

router.use("/health", require("./health.routes"));
router.use("/drones", require("./drone.routes"));

module.exports = router;
