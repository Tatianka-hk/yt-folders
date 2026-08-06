import mongoose from 'mongoose'

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export default async function connectDB() {
    const { MONGODB_URL, MONGODB_DB } = process.env
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        const opts = {
            dbName: MONGODB_DB,
            bufferCommands: false,
            family: 4,
        }

        cached.promise = mongoose.connect(MONGODB_URL, opts).then((m) => {
            console.log('✅ MongoDB Connected')
            return m
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}
