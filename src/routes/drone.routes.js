const express = require('express')
const router = express.Router()
const droneController = require('../controllers/drone.controller')

router.get('/', droneController.getAllDrones)

module.exports = router
