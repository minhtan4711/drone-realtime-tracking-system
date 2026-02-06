const droneService = require('../services/drone.service')

function setupDroneWS(wss) {
    console.log("Drone WebSocket server is set up.")

    wss.on('connection', async (ws) => {
        console.log('Client connected to drone WebSocket.')

        const drones = await droneService.getAllDrones()

        ws.send(JSON.stringify({
            type: 'snapshot',
            mode: 'init',
            ts: Date.now(),
            data: drones,
        }))

        ws.on('close', () => {
            console.log('Client disconnected from drone WebSocket.')
        })
    })
}

async function broadcastSnapshot(wss) {
    const drones = await droneService.getAllDrones()
    const payload = JSON.stringify({
        type: 'snapshot',
        mode: 'tick',
        ts: Date.now(),
        data: drones,
    })

    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(payload)
        }
    })
}

module.exports = {
    setupDroneWS,
    broadcastSnapshot,
}
