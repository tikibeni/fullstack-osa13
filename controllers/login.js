const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { errorHandler } = require("./util");
const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (req, res) => {
    const body = req.body

    const user = await User.findOne({
        where: {
            username: body.username
        }
    })

    const passwordCorrect = body.password === 'salainen'

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    if (user.disabled) {
        return res.status(401).json({
            error: 'account disabled, please contact admin'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    const token = jwt.sign(userForToken, SECRET)

    const existingToken = await Session.findOne({ where: { token } })

    if (existingToken && existingToken.active) {
        res.status(403).json({
            error: 'session already active'
        })
    } else {
        await Session.create({ token, user_id: user.id })
        res
            .status(200)
            .send({ token, username: user.username, name: user.name })
    }
})

router.use(errorHandler)

module.exports = router
