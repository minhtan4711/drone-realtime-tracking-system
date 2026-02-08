const droneStore = require('../storage/drone.store')
const trailStore = require('../storage/trail.store')
const { v4: uuidv4 } = require('uuid')
const { haversineMeters } = require('../utils/geo')

let drones = []

const lastLogged = new Map() // droneId -> { lat, lng, ts }

const DIST_THRESHOLD_METERS = 10
const MAX_LOG_INTERVAL_MS = 5000

function createDrone() {
    return {
        id: uuidv4(),
        lat: 21.0278 + (Math.random() - 0.5) * 0.1,
        lng: 105.8342 + (Math.random() - 0.5) * 0.1,
        heading: Math.random() * 360,
        speed: 10 + Math.random() * 20,
        status: "ACTIVE",
        ts: Date.now(),
    }
}

function moveDrone(drone) {
    const delta = 0.001

    return {
        ...drone,
        lat: drone.lat + (Math.random() - 0.5) * delta,
        lng: drone.lng + (Math.random() - 0.5) * delta,
        heading: (drone.heading + Math.random() * 10) % 360,
        ts: Date.now(),
    }
}

async function initDrones(count) {
    drones = Array.from({ length: count }).map(createDrone)
    await droneStore.clear()
    await droneStore.saveMany(drones)

    const now = Date.now()

    const initialPositions = drones.map(d => ({
        droneId: d.id,
        lat: d.lat,
        lng: d.lng,
        ts: now,
    }))

    await trailStore.appendMany(initialPositions)

    return drones
}


async function updateDrones() {
    drones = drones.map(moveDrone)
    await droneStore.saveMany(drones)

    const now = Date.now()
    const toLog = []

    for (const d of drones) {
        const last = lastLogged.get(d.id)

        let shouldLog = false

        if (!last) {
            shouldLog = true
        } else {
            const dist = haversineMeters(last.lat, last.lng, d.lat, d.lng)
            const dt = now - last.ts

            if (dist >= DIST_THRESHOLD_METERS || dt >= MAX_LOG_INTERVAL_MS) {
                shouldLog = true
            }
        }

        if (shouldLog) {
            toLog.push({
                droneId: d.id,
                lat: d.lat,
                lng: d.lng,
                ts: now,
            })
            lastLogged.set(d.id, { lat: d.lat, lng: d.lng, ts: now })
        }
    }

    if (toLog.length > 0) {
        await trailStore.appendMany(toLog)
    }

    return drones
}

async function getAllDrones() {
    return droneStore.getAll()
}

module.exports = {
    initDrones,
    updateDrones,
    getAllDrones,
}
