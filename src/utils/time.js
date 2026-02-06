// src/utils/time.js
function nowUTC() {
    return new Date().toISOString();
}

function nowVN() {
    return new Date().toLocaleString("sv-SE", {
        timeZone: "Asia/Ho_Chi_Minh",
    });
}

module.exports = {
    nowUTC,
    nowVN,
};
