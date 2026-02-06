const Snapshot = require('../models/snapshot.model')

async function saveSnapshot(ts, drones) {
    return Snapshot.create({ ts, drones })
}

async function getSnapshotAt(ts) {
    return Snapshot.findOne({ ts: { $lte: ts } }).sort({ ts: -1 }).lean()
}

module.exports = {
    saveSnapshot,
    getSnapshotAt,
}
