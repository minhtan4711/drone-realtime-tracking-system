const express = require('express')
const router = express.Router()
const controller = require('../controllers/replay.controller')

router.get('/', controller.replayAt)

module.exports = router
