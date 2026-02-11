const STATUS_ACTIVE = 'ACTIVE'
const STATUS_PENDING = 'PENDING'
const STATUS_OFFLINE = 'OFFLINE'
const ALLOWED_STATUSES = [
    STATUS_ACTIVE,
    STATUS_PENDING,
    STATUS_OFFLINE,
]

const DIST_THRESHOLD_METERS = 15 // minimum movement before writing a new trail point
const MAX_LOG_INTERVAL_MS = 5000 // max time between trail points even if drone barely moves
const SPAWN_RADIUS_KM = 20 // initial spawn radius around each province center

const MOVE_PROB = 0.8 // probability that a drone moves on a tick
const TURN_PROB = 0.15 // probability to change direction and speed on a tick
const SPEED_MIN = 8 // min moving speed when changing direction
const SPEED_MAX = 15 // max moving speed when changing direction

const PENDING_AFTER_MS = 50000 // no movement -> PENDING
const OFFLINE_AFTER_MS = 60000 // no movement -> OFFLINE

module.exports = {
    STATUS_ACTIVE,
    STATUS_PENDING,
    STATUS_OFFLINE,
    ALLOWED_STATUSES,
    DIST_THRESHOLD_METERS,
    MAX_LOG_INTERVAL_MS,
    SPAWN_RADIUS_KM,
    MOVE_PROB,
    TURN_PROB,
    SPEED_MIN,
    SPEED_MAX,
    PENDING_AFTER_MS,
    OFFLINE_AFTER_MS,
}
