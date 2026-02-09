const STATUS_ACTIVE = 'ACTIVE'
const STATUS_PENDING = 'PENDING'
const STATUS_OFFLINE = 'OFFLINE'
const ALLOWED_STATUSES = [
    STATUS_ACTIVE,
    STATUS_PENDING,
    STATUS_OFFLINE,
]

const DIST_THRESHOLD_METERS = 15 // Minimum movement before writing a new trail point.
const MAX_LOG_INTERVAL_MS = 5000 // Max time between trail points even if drone barely moves.
const SPAWN_RADIUS_KM = 20 // Initial spawn radius around each province center.

const MOVE_PROB = 0.8 // Probability that a drone moves on a tick (higher to keep ACTIVE dominant).
const TURN_PROB = 0.15 // Probability to change direction and speed on a tick.
const SPEED_MIN = 8 // Min moving speed when changing direction (meters/second).
const SPEED_MAX = 15 // Max moving speed when changing direction (meters/second).

const PENDING_AFTER_MS = 50000 // No movement for this long becomes PENDING.
const OFFLINE_AFTER_MS = 60000 // No movement for this long becomes OFFLINE.

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
