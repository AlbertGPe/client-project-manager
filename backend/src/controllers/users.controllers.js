const User = require("../models/user.model");
const mailer = require("../config/mailer.config");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports.create = (req, res, next) => {
  const { name, email, password } = req.body;

  const duplicateErrors = {};

  // Verify all unique fields in parallel using Promise.all
  Promise.all([
    User.findOne({ email: email.toLowerCase() }),
    User.findOne({ name: name }),
  ])
    .then(([existingEmailUser, existingNameUser]) => {
      if (existingEmailUser) {
        duplicateErrors.email =
          "This email is already registered. Please use a different email or try logging in.";
      }

      if (existingNameUser) {
        duplicateErrors.name =
          "This username is already taken. Please choose a different one.";
      }

      if (Object.keys(duplicateErrors).length > 0) {
        const error = new Error("Validation failed");
        error.status = 400;
        error.errors = duplicateErrors;
        throw error;
      }

      return User.create({
        name,
        email: email.toLowerCase(),
        password,
      });
    })
    .then((user) => {
      mailer.sendConfirmationEmail(user)
      res.status(201).json(user);
    })
    .catch(next);
};

module.exports.confirm = (req, res, next) => {
  req.user.confirm = true;

  req.user
    .save()
    .then((user) => {
      res.redirect(`${process.env.WEB_URL}/auth/login`);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  User.findOne({ name: req.body.name })
    .then((user) => {
      if (!user) {
        return next(createError(401, "Invalid credentials"));
      }

      if (!user.confirm) {
        return next(createError(401, "Please confirm your account"));
      }

      user.checkPassword(req.body.password).then((match) => {
        if (!match) {
          return next(createError(401, "Invalid credentials"));
        }

        const token = jwt.sign({ sub: user.id }, process.env.TOKEN);
        res.json({ token });
      });
    })
    .catch(next);
};
