const Blog = require('./blog')

Blog.sync().then(_ => console.log(`Sync done for Blog-model`))

module.exports = { Blog }
