const droneService = require('../services/drone.service')
const { saveSnapshot } = require('../storage/snapshot.store')
const { broadcastSnapshot } = require('../ws/drone.ws')

function startDroneSimulator(wss, { tickMs = 1000, snapshotEvery = 1000 } = {}) {
    droneService.initDrones(10000)
    let lastSnapshot = 0


    setInterval(async () => {
        const drones = await droneService.updateDrones()
        const now = Date.now()

        // realtime push
        await broadcastSnapshot(wss, drones)

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
