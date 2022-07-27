const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn('blogs', 'year', {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isAfter: '1991',
                isBefore: '2023' // Tämä voisi olla dynaamisempi... ('new Date.now.getYear()+1' tms)
            },
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn('blogs', 'year')
    },
}
