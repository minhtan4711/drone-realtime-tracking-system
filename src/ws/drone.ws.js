const droneService = require('../services/drone.service')
const { parseStatusList, filterDronesByStatus } = require('../utils/status')

// per-connection status filter
const clientFilters = new WeakMap() // ws -> Set(status)

function setupDroneWS(wss) {
    console.log("Drone WebSocket server is set up.")

    wss.on('connection', async (ws) => {
        console.log('Client connected to drone WebSocket.')

        // send initial snapshot on connect.
        const drones = await droneService.getAllDrones()
        const filter = clientFilters.get(ws)

        ws.send(JSON.stringify({
            type: 'snapshot',
            mode: 'init',
            ts: Date.now(),
            data: filterDronesByStatus(drones, filter),
        }))

        ws.on('close', () => {
            console.log('Client disconnected from drone WebSocket.')
            clientFilters.delete(ws)
        })

        // client can update filter: { type: 'filter', status: 'ACTIVE,PENDING' }
        ws.on('message', (data) => {
            try {
                const msg = JSON.parse(data.toString())
                if (msg?.type !== 'filter') return
                const statusSet = parseStatusList(msg.status)
                if (statusSet) {
                    clientFilters.set(ws, statusSet)
                } else {
                    clientFilters.delete(ws)
                }
            } catch (err) {
                console.log("error: ", err)
            }
        })
    })
}

async function broadcastSnapshot(wss, drones) {
    // use provided snapshot if available to avoid extra Redis reads
    const payloadDrones = drones ?? await droneService.getAllDrones()
    const ts = Date.now()

    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            const filter = clientFilters.get(client)
            client.send(JSON.stringify({
                type: 'snapshot',
                mode: 'tick',
                ts,
                data: filterDronesByStatus(payloadDrones, filter),
            }))
        }
    })
}

module.exports = {
    setupDroneWS,
    broadcastSnapshot,
}
