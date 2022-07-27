const router = require('express').Router()

const { Blog, User } = require('../models')
const { errorHandler, tokenExtractor } = require('./util')
const { Op } = require('sequelize')

/** Middleware yksittäisblogin kaivamiseksi. */
const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {
    const where = {}

    if (req.query.search) {
        where.title = {
            [Op.substring]: req.query.search
        }
    }

    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        },
        where
    })
    const tulostusBlogit = blogs.map(blog => `${blog.toJSON().author}: '${blog.toJSON().title}', ${blog.toJSON().likes} likes`)
    tulostusBlogit.forEach(s => console.log(s))
    res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    return res.json(blog.toJSON())
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.blog.userId === null || user.id === req.blog.userId) {
        await req.blog.destroy()
        res.status(204).end()
    } else {
        res.status(403).end()
    }
})

router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

router.use(errorHandler)

// Router hyödyntää myös 'express-async-errors'-depiä näkyvän try-catchin deprekoimiseksi.
module.exports = router
