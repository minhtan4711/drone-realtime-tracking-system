const droneService = require('../services/drone.service')
const { saveSnapshot } = require('../storage/snapshot.store')
const { broadcastSnapshot } = require('../ws/drone.ws')

async function startDroneSimulator(wss, { tickMs = 1000, snapshotEvery = 1000 } = {}) {
    // initial dat
    await droneService.initDrones(10000)
    let lastSnapshot = 0

    const loop = async () => {
        const drones = await droneService.updateDrones()
        const now = Date.now()

        // push latest state to connected clients
        await broadcastSnapshot(wss, drones)

        if (now - lastSnapshot >= snapshotEvery) {
            lastSnapshot = now
            // snapshot for replay.
            await saveSnapshot(now, drones)
            console.log(`Snapshot saved at ${new Date(now).toISOString()}`)
        }

        // previous tick complete so next tick to avoid overlap
        setTimeout(loop, tickMs)
    }

    loop()
}

module.exports = {
    startDroneSimulator,
}
