const express = require("express")
const router = express.Router()

router.use("/health", require("./health.routes"))
router.use("/drones", require("./drone.routes"))
router.use("/replay", require("./replay.routes"))
router.use("/trails", require("./trail.route"))


module.exports = router;
