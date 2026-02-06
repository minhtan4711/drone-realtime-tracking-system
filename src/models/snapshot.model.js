const mongoose = require('mongoose')

const SnapshotSchema = new mongoose.Schema({
    ts: { type: Date, index: true },
    drones: [
        {
            id: String,
            lat: Number,
            lng: Number,
            heading: Number,
            speed: Number,
            status: String,
        },
    ]
})

module.exports = mongoose.model('Snapshot', SnapshotSchema)
