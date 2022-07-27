const router = require('express').Router()

const { sequelize } = require("../util/db");
const { Blog } = require('../models')
const { errorHandler } = require('./util')

router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('title')), 'blogs'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
        ],
        group: 'author',
        order: sequelize.literal('max(likes) DESC')
    })
    res.json(authors)
})

router.use(errorHandler)

module.exports = router
