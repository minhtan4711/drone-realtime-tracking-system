const droneStore = require('../storage/drone.store')
const trailStore = require('../storage/trail.store')
const { v4: uuidv4 } = require('uuid')
const { haversineMeters } = require('../utils/geo')
const provinces = require('../data/vietnam.province')
const {
    STATUS_ACTIVE,
    STATUS_PENDING,
    STATUS_OFFLINE,
    DIST_THRESHOLD_METERS,
    MAX_LOG_INTERVAL_MS,
    SPAWN_RADIUS_KM,
    MOVE_PROB,
    TURN_PROB,
    SPEED_MIN,
    SPEED_MAX,
    PENDING_AFTER_MS,
    OFFLINE_AFTER_MS,
} = require('../constants/drone.constants')

let drones = []

// track last trail point per drone to decide when to log a new point.
const lastLogged = new Map() // droneId -> { lat, lng, ts }

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
    // start with a reasonable moving speed to keep most drones ACTIVE.
    const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
    const now = Date.now()
    return {
        id: uuidv4(),
        lat,
        lng,
        heading: Math.random() * 360,
        speed,
        lastMovedAt: now,
        status: STATUS_ACTIVE,
        ts: now,
    }
}

function moveDrone(drone, dtMs = 1000) {
    const now = Date.now()
    let heading = drone.heading
    let speed = drone.speed

    // most drones stay still to mimic sparse movement.
    if (Math.random() > MOVE_PROB) {
        speed = 0
        return {
            ...drone,
            speed,
            status: computeStatus(drone.lastMovedAt, now),
            ts: now,
        }
    }

    // occasionally change direction/speed for more natural
    if (Math.random() < TURN_PROB) {
        heading = Math.random() * 360
        speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
    }

    const dt = dtMs / 1000
    const distance = speed * dt // meters

    // meters -> degrees conversion (approximation).
    const dLat = (distance / 111320) * Math.cos((heading * Math.PI) / 180)
    const dLng =
        (distance /
            (111320 * Math.cos((drone.lat * Math.PI) / 180))) *
        Math.sin((heading * Math.PI) / 180)

    const lastMovedAt = speed > 0 ? now : drone.lastMovedAt

    return {
        ...drone,
        lat: drone.lat + dLat,
        lng: drone.lng + dLng,
        heading,
        speed,
        status: computeStatus(lastMovedAt, now),
        lastMovedAt,
        ts: now,
    }
}

function computeStatus(lastMovedAt, now) {
    // status is derived from how long the drone has been idle.
    const idleFor = now - lastMovedAt
    if (idleFor >= OFFLINE_AFTER_MS) return STATUS_OFFLINE
    if (idleFor >= PENDING_AFTER_MS) return STATUS_PENDING
    return STATUS_ACTIVE
}

async function initDrones(count) {
    // spawn drone randomly accross Vietnam
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
    // seed initial trail points so each drone has a starting position.
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

            // log trail if the drone moved far enough or too much time passed.
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
