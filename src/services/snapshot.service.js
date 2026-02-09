const snapshotStore = require('../storage/snapshot.store')

async function getSnapshotAt(ts) {
    return snapshotStore.getSnapshotAt(ts)
}

module.exports = {
    getSnapshotAt,
}
