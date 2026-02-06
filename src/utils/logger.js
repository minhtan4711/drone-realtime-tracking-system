const { nowVN } = require('./time')

function log(level, message, meta = {}) {
    const entry = {
        time: nowVN(),
        level,
        message,
        ...meta,
    }
    console.log(JSON.stringify(entry))
}

module.exports = {
    info: (msg, meta) => log("INFO", msg, meta),
    warn: (msg, meta) => log("WARN", msg, meta),
    error: (msg, meta) => log("ERROR", msg, meta),
}
