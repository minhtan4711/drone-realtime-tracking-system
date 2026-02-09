const snapshotStore = require('../storage/snapshot.store')
const { filterDronesByStatus } = require('../utils/status')


function emptyStats() {
    return {
        ACTIVE: 0,
        PENDING: 0,
        OFFLINE: 0,
    }
}

function aggregateByStatus(drones) {
    const stats = emptyStats()

    for (const d of drones) {
        if (stats[d.status] !== undefined) {
            stats[d.status]++
        }
    }

    return stats
}

async function getSnapshotAt(ts, statusSet) {
    const snap = await snapshotStore.getSnapshotAt(ts)
    if (!snap) return null

    const filteredDrones = filterDronesByStatus(snap.drones, statusSet)

    return {
        ts: snap.ts,
        total: filteredDrones.length,
        byStatus: aggregateByStatus(filteredDrones),
        drones: filteredDrones,
    }
}

module.exports = {
    getSnapshotAt,
}
