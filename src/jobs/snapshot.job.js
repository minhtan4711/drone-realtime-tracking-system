const Snapshot = require('../models/snapshot.model')
const redis = require('../config/redis')

async function saveSnapshot() {
    const keys = await redis.keys('drone:*')
    const drones = Object.values(raw).map((json) => JSON.parse(json))

    await Snapshot.create({
        ts: new Date(),
        drones
    })

    console.log(`Snapshot saved: ${drones.length} drones`)
}

function startSnapshotJob({ intervalMs = 5000 } = {}) {
    setInterval(saveSnapshot, intervalMs)
}

module.exports = {
    startSnapshotJob,
}
