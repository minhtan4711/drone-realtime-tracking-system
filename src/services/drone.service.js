const droneStore = require('../storage/drone.store')
const trailStore = require('../storage/trail.store')
const { v4: uuidv4 } = require('uuid')
const { haversineMeters } = require('../utils/geo')
const provinces = require('../data/vietnam.province')

let drones = []

const lastLogged = new Map() // droneId -> { lat, lng, ts }

const DIST_THRESHOLD_METERS = 15
const MAX_LOG_INTERVAL_MS = 5000
const SPAWN_RADIUS_KM = 20

const MOVE_PROB = 0.25
const TURN_PROB = 0.1
const SPEED_MIN = 5
const SPEED_MAX = 20

function randomOffsetKm(km) {
    const delta = km / 111
    return (Math.random() - 0.5) * delta
}

function spawnNear(lat, lng, radiusKm) {
    return {
        lat: lat + randomOffsetKm(radiusKm),
        lng: lng + randomOffsetKm(radiusKm),
    }
}

function createDrone({ lat, lng }) {
    return {
        id: uuidv4(),
        lat,
        lng,
        heading: Math.random() * 360,
        speed: 10 + Math.random() * 20,
        status: "ACTIVE",
        ts: Date.now(),
    }
}

function moveDrone(drone, dtMs = 1000) {
    // 75% drone stay still
    if (Math.random() > MOVE_PROB) {
        return { ...drone, ts: Date.now() }
    }

    let heading = drone.heading
    let speed = drone.speed

    // change direction
    if (Math.random() < TURN_PROB) {
        heading = Math.random() * 360
        speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
    }

    const dt = dtMs / 1000
    const distance = speed * dt // meters

    // meter → lat/lng
    const dLat = (distance / 111320) * Math.cos((heading * Math.PI) / 180)
    const dLng =
        (distance /
            (111320 * Math.cos((drone.lat * Math.PI) / 180))) *
        Math.sin((heading * Math.PI) / 180)

    return {
        ...drone,
        lat: drone.lat + dLat,
        lng: drone.lng + dLng,
        heading,
        speed,
        ts: Date.now(),
    }
}

async function initDrones(count) {
    drones = []
    lastLogged.clear()

    const perProvince = Math.floor(count / provinces.length)
    const remainder = count % provinces.length

    provinces.forEach((p, i) => {
        const n = perProvince + (i < remainder ? 1 : 0)

        for (let j = 0; j < n; j++) {
            const { lat, lng } = spawnNear(p.lat, p.lng, SPAWN_RADIUS_KM)
            drones.push(createDrone({ lat, lng }))
        }
    })

    await droneStore.clear()
    await droneStore.saveMany(drones)

    const now = Date.now()
    const initialPositions = drones.map((d) => ({
        droneId: d.id,
        lat: d.lat,
        lng: d.lng,
        ts: now,
    }))

    await trailStore.appendMany(initialPositions)

    initialPositions.forEach((p) => {
        lastLogged.set(p.droneId, { lat: p.lat, lng: p.lng, ts: now })
    })

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
