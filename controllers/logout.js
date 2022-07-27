const router = require('express').Router()

const { errorHandler, tokenExtractor } = require('./util')
const Session = require('../models/session')

router.post('/', tokenExtractor, async (req, res) => {
    if (req.decodedToken) {
        const existingSession = await Session.findOne({ where: { token: req.rawToken } })
        existingSession.active = false
        await existingSession.save()
        res.status(200).end()
    } else {
        res.status(404).end()
    }
})

router.use(errorHandler)

module.exports = router
