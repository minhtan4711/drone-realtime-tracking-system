const trailService = require("../services/trail.service")

async function getTrailByDrone(req, res) {
    const { droneId } = req.params
    const windowMs = Number(req.query.windowMs) || undefined

    const result = await trailService.getTrailByDroneId(droneId, Date.now(), windowMs)

    res.json(result)
}

module.exports = {
    getTrailByDrone,
}
