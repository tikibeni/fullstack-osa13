const router = require('express').Router()

const { Readlist } = require('../models')
const { errorHandler } = require('./util')

router.post('/', async (req, res) => {
    const list = await Readlist.create(req.body)
    res.json(list)
})

router.use(errorHandler)

// Router hyödyntää myös 'express-async-errors'-depiä näkyvän try-catchin deprekoimiseksi.
module.exports = router
