/** Middleware virheidenkäsittelylle */
const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    if (['ValidationError', 'SequelizeDatabaseError'].includes(error.name)) {
        return res.status(400).json({ message: error.message })
    }

    next(error)
}

module.exports = { errorHandler }