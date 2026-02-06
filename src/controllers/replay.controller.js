const replayService = require('../services/replay.service')

async function replayAt(req, res, next) {
    try {
        const ts = req.query.ts
        if (!ts) {
            return res.status(400).json({ error: 'Missing ts query parameter' })
        }

        const date = new Date(Number(ts))
        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: 'Invalid ts query parameter' })
        }

        const snapshot = await replayService.getSnapshotAt(date)
        if (!snapshot) {
            return res.status(404).json({ error: 'No snapshot found' })
        }

        res.json(snapshot)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    replayAt,
}
