const trailStore = require('../storage/trail.store')
const droneStore = require('../storage/drone.store')

async function getTrailByDroneId(droneId, now = Date.now(), windowMs = 5 * 60 * 1000) {
    const from = now - windowMs
    const to = now

    const points = await trailStore.getTrailWindow(droneId, from, to)

    return {
        droneId,
        from,
        to,
        positions: points.map((p) => ({
            lat: p.lat,
            lng: p.lng,
            ts: p.ts ?? null
        }))
    }
}

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
    getTrailByDroneId
}
