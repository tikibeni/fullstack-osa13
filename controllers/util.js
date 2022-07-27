const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const Session = require('../models/session')

/** Middleware virheidenkäsittelylle */
const errorHandler = (error, req, res, next) => {
    console.error(error.message)

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
const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            const rawtoken = authorization.substring(7)
            const existingToken = await Session.findOne({ where: { token: rawtoken } })
            if (existingToken && existingToken.active) {
                req.decodedToken = jwt.verify(rawtoken, SECRET)
                req.rawToken = rawtoken
            } else {
                return res.status(401).json({ error: 'token invalid' })
            }
        } catch (error) {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

module.exports = { errorHandler, tokenExtractor }