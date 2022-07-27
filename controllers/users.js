const router = require('express').Router()

const { User, Blog } = require('../models')
const { errorHandler } = require('./util')

/** Middleware yksittäiskäyttäjän kaivamiseksi. */
const userFinder = async (req, res, next) => {
    req.user = req.params.id
        ? await User.findByPk(req.params.id)
        : await User.findOne({ where: { username: req.params.username } })

    next()
}

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: [
            {
                model: Blog ,
                attributes: { exclude: ['userId'] }
            },
            {
                model: Blog,
                as: 'listedBlogs',
                attributes: { exclude: ['userId'] },
                through: { attributes: ['read'] }
            }
        ]
    })
    res.json(users)
})

router.get('/:id', userFinder, async (req, res) => {
    const user = await User.findByPk(req.params.id, {
        include: [
            {
                model: Blog,
                as: 'listedBlogs',
                attributes: { exclude: ['userId'] },
                through: { attributes: ['read'] }
            }
        ]
    })

    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

router.post('/', async (req, res) => {
    const user = await User.create(req.body)
    res.json(user)
})

router.put('/:username', userFinder, async (req, res) => {
    if (req.user) {
        req.user.name = req.body.name
        await req.user.save()
        res.json(req.user)
    } else {
        res.status(404).end()
    }
})

router.use(errorHandler)

// Router hyödyntää myös 'express-async-errors'-depiä näkyvän try-catchin deprekoimiseksi.
module.exports = router
