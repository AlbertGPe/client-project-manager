const Client = require('../models/client.model');
const createError = require('http-errors')

module.exports.exists = (req, res, next) => {
  const clientId = req.params.clientId || req.params.id
  Client.findById(clientId)
    .then((client) => {
      if (client) {
        req.client = client;
        next();
      } else {
        next(createError(404, 'Client not found'))
      }
    })
}

module.exports.checkUser = (req, res, next) => {
  if (req.client.user.toString() !== req.user.id) {
    next(createError(403, "Forbidden"))
  } else {
    next();
  }
}