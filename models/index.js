const Blog = require('./blog')
const User = require('./user')
const Readlist = require('./readlist')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Readlist, as: 'listedBlogs' })
Blog.belongsToMany(User, { through: Readlist, as: 'usersListed' })

User.hasMany(Session)
Session.belongsTo(User)

module.exports = { Blog, User, Readlist, Session }
