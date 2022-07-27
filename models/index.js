const Blog = require('./blog')
const User = require('./user')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.sync({ alter: true }).then(_ => console.log(`Sync done for Blog-model`))
User.sync({ alter: true }).then(_ => console.log(`Sync done for User-model`))

module.exports = { Blog, User }
