const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('sessions', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            token: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' }
            },
            created_at: {
                type: DataTypes.DATE
            },
            updated_at: {
                type: DataTypes.DATE
            }
        })
        await queryInterface.addColumn('users', 'disabled', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('sessions')
        await queryInterface.removeColumn('users', 'disabled')
    },
}
