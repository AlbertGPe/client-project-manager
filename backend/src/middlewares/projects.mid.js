const Project = require('../models/project.model');
const Client = require('../models/client.model')
const createError = require('http-errors');

module.exports.exists = (req, res, next) => {
  const projectId = req.params.projectId || req.params.id;
  Project.findById(projectId)
    .then((project) => {
      if (project) {
        req.project = project;
        next();
      } else {
        next(createError(404, 'Project not found'))
      }
    })
}

module.exports.checkUser = (req, res, next) => {
   Client.findById(req.project.client)
    .then((client) => {
      if (client.user.toString() !== req.user.id) {
        next(createError(403, "Forbidden"));
      } else {
        next();
      }
    })
    .catch(next);
}