const Blog = require('./blog')
const User = require('./user')

Blog.sync().then(_ => console.log(`Sync done for Blog-model`))
User.sync().then(_ => console.log(`Sync done for User-model`))

module.exports = { Blog, User }
