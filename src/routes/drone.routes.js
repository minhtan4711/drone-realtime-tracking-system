const express = require('express')
const router = express.Router()
const droneController = require('../controllers/drone.controller')

router.get('/', droneController.getCurrentDrones)

module.exports = router
