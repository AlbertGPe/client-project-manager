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