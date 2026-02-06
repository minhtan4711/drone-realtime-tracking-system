const { nowVN } = require("../utils/time")

function health(req, res) {
    res.json({
        status: "OK",
        service: "Drone Realtime Tracking System",
        timestamp: nowVN(),
    })
}

module.exports = { health }
