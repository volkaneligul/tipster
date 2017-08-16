// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
module.exports = {
  DB: process.env.MONGODB_URI || 'mongodb://localhost:27017/tipster'
};