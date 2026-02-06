require("dotenv").config()

const http = require("http")
const app = require("./app")
const { startDroneSimulator } = require('./simulator/drone.simulator')
const { connectMongoDB } = require('./config/db')

const PORT = process.env.PORT || 3000

async function bootstrap() {
    await connectMongoDB()

    const server = http.createServer(app)

    startDroneSimulator()

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

bootstrap()
