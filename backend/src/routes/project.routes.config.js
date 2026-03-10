const express = require('express');
const router = express.Router();
const projects = require('../controllers/pojects.controllers')
const projectsMid = require('../middlewares/projects.mid')
const secureMid = require('../middlewares/secure.mid')


todo = (req, res, next) => {
  res.send('TODO')
}

router.get('/projects',
  //secureMid.auth, 
  projects.list) //NEED JWT (done)

router.get('/projects/client/:clientId', 
  todo) //NEED JWT //TODO

router.get('/projects/:id',
  secureMid.auth,
  projectsMid.exists,
  projects.detail) //NEED JWT (done)

router.post('/projects',
  secureMid.auth,
  projects.create) //NEED JWT (done)

router.patch('/projects/:id',
  secureMid.auth,
  projectsMid.exists,
  projectsMid.checkUser,
  projects.update) //NEED JWT (done) - NEED OWNER (done)

router.delete('/projects/:id',
  secureMid.auth, 
  projectsMid.exists,
  projectsMid.checkUser, 
  projects.delete) //NEED JWT (done) - NEED OWNER (done)

module.exports = router;