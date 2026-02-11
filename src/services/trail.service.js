const trailStore = require('../storage/trail.store')

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

module.exports = {
    getTrailByDroneId
}
