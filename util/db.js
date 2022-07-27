const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        timezone: "Europe/Helsinki"
    },
    timezone: "Europe/Helsinki"
});

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connected to database')
    } catch (e) {
        console.log(`Database connection failed: ${e.message}`)
        return process.exit(1)
    }

    return null
}

module.exports = { connectToDatabase, sequelize }
