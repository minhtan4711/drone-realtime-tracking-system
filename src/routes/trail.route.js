const express = require('express')
const router = express.Router()
const trailService = require('../services/trail.service')
const droneService = require('../services/drone.service')

router.get('/window', async (req, res) => {
    try {
        const ts = Number(req.query.ts)
        const windowMs = Number(req.query.windowMs || 5 * 60 * 1000)

        if (!ts) return res.status(400).json({ error: 'ts is required' })

        const drones = await droneService.getAllDrones()
        const droneIds = drones.map(d => d.id)

        const data = await trailService.getTrailWindow(ts, windowMs, droneIds)
        res.json(data)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch trail window' })
    }
})

module.exports = router