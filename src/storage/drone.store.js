const redis = require('../config/redis')

const KEY = 'drones:current'

async function saveDrone(drone) {
    return redis.hset(KEY, drone.id, JSON.stringify(drone))
}

async function saveMany(drones) {
    const pipeline = redis.pipeline()
    drones.forEach((drone) => {
        pipeline.hset(KEY, drone.id, JSON.stringify(drone))
    });
    return pipeline.exec()
}

async function getAll() {
    const data = await redis.hgetall(KEY)
    return Object.values(data).map(JSON.parse)
}

async function clear() {
    return redis.del(KEY);
}

module.exports = {
    saveDrone,
    saveMany,
    getAll,
    clear,
}
