const droneService = require('../services/drone.service')
const { saveSnapshot } = require('../storage/snapshot.store')

function startDroneSimulator({ tickMs = 1000, snapshotEvery = 3000 } = {}) {
    droneService.initDrones(5)
    let lastSnapshot = 0


    setInterval(async () => {
        const drones = await droneService.updateDrones()
        const now = Date.now()

        if (now - lastSnapshot >= snapshotEvery) {
            lastSnapshot = now
            await saveSnapshot(now, drones)
            console.log(`Snapshot saved at ${new Date(now).toISOString()}`)
        }
    }, tickMs)
}

module.exports = {
    startDroneSimulator,
}
