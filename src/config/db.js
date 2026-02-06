const mongoose = require('mongoose')

async function connectMongoDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')
    } catch (err) {
        console.error('Mongo connection error:', err)
        process.exit(1)
    }
}

module.exports = {
    connectMongoDB,
}
