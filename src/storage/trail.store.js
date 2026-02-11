const redis = require('../config/redis')

// sliding window for trail history kept in redis
const WINDOW_MS = 5 * 60 * 1000 // keep last 5 minutes of positions

function key(droneId) {
    // one ZSET per drone to store time-ordered points
    return `trail:${droneId}`
}


async function appendMany(positions) {
    if (!positions || positions.length === 0) return

    // insert data by pipeline
    const pipeline = redis.pipeline()

    for (const p of positions) {
        const k = key(p.droneId)

        // ZSET score is timestamp for range queries by time window
        pipeline.zadd(k, p.ts, JSON.stringify({
            lat: p.lat,
            lng: p.lng,
            ts: p.ts,
        }))

        // trim data outside the retention window.
        const cutoff = p.ts - WINDOW_MS
        pipeline.zremrangebyscore(k, 0, cutoff)
    }

    await pipeline.exec()
}

async function getTrailWindow(droneId, fromTs, toTs) {
    const k = key(droneId)
    const rows = await redis.zrangebyscore(k, fromTs, toTs)
    return rows.map(v => JSON.parse(v))
}


module.exports = {
    appendMany,
    getTrailWindow,
}
