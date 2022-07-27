const router = require('express').Router()

const { Blog } = require('../models')
const { errorHandler } = require('./util')

/** Middleware yksittäisblogin kaivamiseksi. */
const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
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

router.post('/', async (req, res, next) => {
    const blog = await Blog.create(req.body).catch(error => next(error))
    return res.json(blog.toJSON())
})

router.delete('/:id', blogFinder, async (req, res) => {
    await req.blog.destroy()
    res.status(204).end()
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
