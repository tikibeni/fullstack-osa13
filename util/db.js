const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

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

const runMigrations = async () => {
    const migrator = new Umzug({
        migrations: {
            glob: 'migrations/*.js',
        },
        storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
        context: sequelize.getQueryInterface(),
        logger: console
    })
    const migrations = await migrator.up()
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name)
    })
}

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        await runMigrations()
        console.log('Connected to database')
    } catch (e) {
        console.log(`Database connection failed: ${e.message}`)
        return process.exit(1)
    }

    return null
}

module.exports = { connectToDatabase, sequelize }
