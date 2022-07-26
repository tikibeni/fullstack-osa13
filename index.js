require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require("express")
const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})
Blog.sync().then(r => console.log(`Sync done ${r}`))

app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll()
    const tulostusBlogit = blogs.map(blog => `${blog.toJSON().author}: '${blog.toJSON().title}', ${blog.toJSON().likes} likes`)
    tulostusBlogit.forEach(s => console.log(s))
    res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        return res.json(blog.toJSON())
    } catch (e) {
        return res.status(400).json({ e })
    }
})

app.delete('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        await blog.destroy().finally(res.status(200))
    } else {
        res.status(404).end()
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
    console.log(`Server running on port ${PORT}`)
})
