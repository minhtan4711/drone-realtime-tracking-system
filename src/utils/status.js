const { ALLOWED_STATUSES } = require('../constants/drone.constants')

function parseStatusList(raw) {
    if (raw === undefined || raw === null) return null
    const joined = Array.isArray(raw) ? raw.join(',') : String(raw)
    const valid = joined
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter((s) => ALLOWED_STATUSES.includes(s))

    if (valid.length === 0) return null
    return new Set(valid)
}

function filterDronesByStatus(drones, statusSet) {
    if (!statusSet || statusSet.size === 0) return drones
    return drones.filter((d) => statusSet.has(d.status))
}

module.exports = {
    parseStatusList,
    filterDronesByStatus,
}
