const router = require('express').Router()

const { Readlist, User} = require('../models')
const { errorHandler, tokenExtractor } = require('./util')

const readlistFinder = async (req, res, next) => {
    req.readinglist = await Readlist.findByPk(req.params.id)
    next()
}

router.post('/', async (req, res) => {
    const list = await Readlist.create(req.body)
    res.json(list)
})

router.put('/:id', readlistFinder, tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (user.id === req.readinglist.userId) {
        if (req.readinglist) {
            req.readinglist.read = req.body.read
            await req.readinglist.save()
            res.json(req.readinglist)
        } else {
            res.status(404).end()
        }
    } else {
        res.status(403).end()
    }
})

router.use(errorHandler)

// Router hyödyntää myös 'express-async-errors'-depiä näkyvän try-catchin deprekoimiseksi.
module.exports = router
