const droneService = require('../services/drone.service')

async function getAllDrones(req, res, next) {
    try {
        const drones = await droneService.getAllDrones()
        res.json({
            count: drones.length,
            data: drones,
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getAllDrones,
}
