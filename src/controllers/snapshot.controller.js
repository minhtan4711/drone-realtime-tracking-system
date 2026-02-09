const snapshotService = require('../services/snapshot.service')
const { parseStatusList } = require('../utils/status')

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

        const statusSet = parseStatusList(req.query.status)
        if (req.query.status !== undefined && !statusSet) {
            return res.status(400).json({ error: 'Invalid status filter' })
        }

        const snapshot = await snapshotService.getSnapshotAt(date, statusSet)
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
