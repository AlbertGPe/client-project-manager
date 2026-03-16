const Client = require("../models/client.model");
const createError = require("http-errors");

module.exports.list = (req, res, next) => {
  Client.find()
    .populate('projects')
    .then((clients) => {
      res.json(clients)
      console.log(clients[0].projects)
    })
    .catch(next);
};

module.exports.create = (req, res, next) => {
  req.body.user = req.user?.id
  Client.create(req.body)
    .then((client) => res.status(201).json(client))
    .catch(next);
};

module.exports.detail = (req, res, next) => res.json(req.client);

module.exports.delete = (req, res, next) => {
  req.client.deleteOne()
    .then(() => res.status(204).send())
    .catch(next);
};

module.exports.update = (req, res, next) => {
  delete req.body.user;
  // if(req.body.user) {
  //   return  next(createError(401, "You can't modify the User"));
  // }

  if (Object.keys(req.body).length === 0) {
    return next(createError(400, "Fill at least 1 camp"));
  }

  Object.assign(req.client, req.body);

  req.client
    .save()
    .then((client) => res.json(client))
    .catch(next);
};
