const User = require('../models/user.model');
const mailer = require('../config/mailer.config')
const createError = require('http-errors');
const jwt = require('jsonwebtoken')

module.exports.create = (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      mailer.sendConfirmationEmail(user)
      res.status(201).json(user)
    })
    .catch(next);
};

module.exports.confirm = (req, res, next) => {
  req.user.confirm = true;

  req.user.save()
    .then((user) => {
      res.redirect(`${process.env.WEB_URL}/login`)
    })
    .catch(next)
}

module.exports.login = (req, res, next) => {
  User.findOne({ name: req.body.name})
    .then((user) => {
      if (!user) {
        return next(createError(401, 'Invalid credentials'))
      }

      if (!user.confirm) {
        return next(createError(401, 'Please confirm your account'))
      }

      user.checkPassword(req.body.password)
        .then((match) => {
          if (!match) {
            return next(createError(401, 'Invalid credentials'))
          }

          const token = jwt.sign({ sub: user.id}, process.env.TOKEN);
          res.json({ token })
        })
    })
    .catch(next)
}