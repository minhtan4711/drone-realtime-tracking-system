const express = require('express')
const router = express.Router()
const trailService = require('../services/trail.service')
const droneService = require('../services/drone.service')
const trailController = require('../controllers/trail.controller')

router.get("/:droneId", trailController.getTrailByDrone)

module.exports = router