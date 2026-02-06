const droneStore = require('../storage/drone.store')
const { v4: uuidv4 } = require('uuid')

let drones = []

function createDrone() {
    return {
        id: uuidv4(),
        lat: 21 + Math.random(),
        lng: 105 + Math.random(),
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

async function initDrones(count = 5) {
    drones = Array.from({ length: count }).map(createDrone)
    await droneStore.clear()
    await droneStore.saveMany(drones)
    return drones
}

async function updateDrones() {
    drones = drones.map(moveDrone)
    await droneStore.saveMany(drones)
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
