const express = require('express');
const router = express.Router();
const projects = require('../controllers/pojects.controllers')
const projectsMid = require('../middlewares/projects.mid')


todo = (req, res, next) => {
  res.send('TODO')
}

router.get('/projects', projects.list) //NEED JWT
router.get('/projects/:id', projectsMid.exists, projects.detail) //NEED JWT
router.get('/projects/client/:clientId', todo) //NEED JWT
router.post('/projects', projects.create) //NEED JWT - NEED ADMIN
router.patch('/projects/:id', projectsMid.exists, projects.update) //NEED JWT - NEED ADMIN
router.delete('/projects/:id', projectsMid.exists, projects.delete) //NEED JWT - NEED ADMIN

module.exports = router;