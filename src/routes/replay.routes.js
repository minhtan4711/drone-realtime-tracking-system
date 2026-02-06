const express = require('express')
const router = express.Router()
const replayController = require('../controllers/replay.controller')

router.get('/', replayController.replayAt)

module.exports = router
