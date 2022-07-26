const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    const tulostusBlogit = blogs.map(blog => `${blog.toJSON().author}: '${blog.toJSON().title}', ${blog.toJSON().likes} likes`)
    tulostusBlogit.forEach(s => console.log(s))
    res.json(blogs)
})

router.post('/', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        return res.json(blog.toJSON())
    } catch (e) {
        return res.status(400).json({ e })
    }
})

router.delete('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        await blog.destroy().finally(res.status(204).end())
    } else {
        res.status(404).end()
    }
})

module.exports = router
