const droneService = require('../services/drone.service')

function getCurrentDrones(req, res) {
    const snapshot = droneService.getCurrentSnapshot()
    res.json({
        ts: snapshot.ts,
        count: snapshot.drones.length,
        drones: snapshot.drones,
    })
}

module.exports = {
    getCurrentDrones,
}
