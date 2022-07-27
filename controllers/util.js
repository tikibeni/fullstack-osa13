const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

/** Middleware virheidenkäsittelylle */
const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    console.error(error)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: `Toimintoon liittyvä validointivirhe - korjaa arvojen muodot. Lisäinfoa: ${error.message}` })
    }
    if (['ValidationError', 'SequelizeDatabaseError'].includes(error.name)) {
        return res.status(400).json({ message: error.message })
    }

    next(error)
}

/** Middleware kirjautumistokenin kaivamiselle */
const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            console.log(authorization.substring(7))
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch (error){
            console.log(error)
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()

}

module.exports = { errorHandler, tokenExtractor }