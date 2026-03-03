const Project = require('../models/project.model');
const createError = require('http-errors');

module.exports.exists = (req, res, next) => {
  Project.findById(req.params.id)
    .then((project) => {
      if (project) {
        req.project = project;
        next();
      } else {
        next(createError(404, 'Project not found'))
      }
    })
}