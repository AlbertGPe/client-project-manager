const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const User = require('../models/user.model')


module.exports.removeId = (req, res, next) => {
  if (req.body) {
    delete req.body._id;
    delete req.body.createdAt;
    delete req.body.updatedAt;
    delete req.body.confirm;
  }
  next();
}

module.exports.auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if(!token) {
    return next(createError(401, 'Missing acces token'))
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN);

    User.findById(decoded.sub)
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          next(createError(401, 'User not found'))
        }
      })
      .catch(next)
  } catch (err) {
    next(createError(401, err))
  }
}