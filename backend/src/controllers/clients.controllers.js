const Client = require('../models/client.model')

module.exports.list = (req, res, next) => {
  Client.find()
    .then((clients) => res.json(clients))
    .catch(next);
}

module.exports.create = (req, res, next) => {
  Client.create(req.body)
    .then((client) => res.status(201).json(client))
    .catch(next)
}

module.exports.detail = (req, res, next) => res.json(req.client)

module.exports.delete = (req, res, next) => {
  Client.deleteOne({ _id: req.client.id })
    .then((client) => res.status(204).send())
    .catch(next)
}

module.exports.update = (req, res, next) => {
  Object.assign(req.client, req.body)
  req.client.save()
    .then((client) => res.json(client))
    .catch(next)
}