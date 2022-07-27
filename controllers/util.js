/** Middleware virheidenkäsittelylle */
const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    if (['ValidationError', 'SequelizeValidationError', 'SequelizeDatabaseError'].includes(error.name)) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: `Toimintoon liittyvä validointivirhe - korjaa arvojen muodot. Lisäinfoa: ${error.message}` })
        }
        return res.status(400).json({ message: error.message })
    }

    next(error)
}

module.exports = { errorHandler }