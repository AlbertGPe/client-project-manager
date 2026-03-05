const User = require('../models/user.model');
const mailer = require('../config/mailer.config')

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