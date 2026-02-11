require("dotenv").config()

const http = require("http")
const { WebSocketServer } = require("ws")
const app = require("./app")
const { startDroneSimulator } = require('./simulator/drone.simulator')
const { setupDroneWS } = require('./ws/drone.ws')
const { connectMongoDB } = require('./config/db')

const PORT = process.env.PORT || 3000

async function bootstrap() {
    // connect database before starting HTTP/WS servers.
    await connectMongoDB()

    const server = http.createServer(app)

    // attach WebSocket server for realtime drone updates
    const wss = new WebSocketServer({
        server,
        path: '/ws/drones',
    })

    // initialize WebSocket handlers and simulator loop.
    setupDroneWS(wss)
    startDroneSimulator(wss)

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

bootstrap()
