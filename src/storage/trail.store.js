const redis = require('../config/redis')

const WINDOW_MS = 5 * 60 * 1000 // 5 minutes

function key(droneId) {
    return `trail:${droneId}`
}


async function appendMany(positions) {
    if (!positions || positions.length === 0) return

    const pipeline = redis.pipeline()

    for (const p of positions) {
        const k = key(p.droneId)

        pipeline.zadd(k, p.ts, JSON.stringify({
            lat: p.lat,
            lng: p.lng,
            ts: p.ts,
        }))

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


async function getMultiTrailWindow(droneIds, fromTs, toTs) {
    if (!droneIds || droneIds.length === 0) return {}

    const pipeline = redis.pipeline()
    const keys = droneIds.map(id => key(id))

    for (const k of keys) {
        pipeline.zrangebyscore(k, fromTs, toTs)
    }

    const results = await pipeline.exec()

    const out = {}
    for (let i = 0; i < droneIds.length; i++) {
        const rows = results[i][1]
        if (rows && rows.length > 0) {
            out[droneIds[i]] = rows.map(v => JSON.parse(v))
        }
    }

    return out
}

module.exports = {
    appendMany,
    getTrailWindow,
    getMultiTrailWindow,
}
