const trailStore = require('../storage/trail.store')
const droneStore = require('../storage/drone.store')

async function getTrailWindow(ts, windowMs = 5 * 60 * 1000) {
    const from = ts - windowMs
    const to = ts

    const drones = await droneStore.getAll()
    const droneIds = drones.map(d => d.id)

    const positionsByDrone = await trailStore.getMultiTrailWindow(
        droneIds,
        from,
        to
    )

    return {
        from,
        to,
        positionsByDrone,
    }
}

module.exports = {
    getTrailWindow,
}
