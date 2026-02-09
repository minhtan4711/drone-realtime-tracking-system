const express = require('express')
const router = express.Router()
const snapshotController = require('../controllers/snapshot.controller')

router.get('/', snapshotController.replayAt)

module.exports = router
