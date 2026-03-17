const express = require('express');
const router = express.Router();
const projects = require('../controllers/projects.controllers')
const projectsMid = require('../middlewares/projects.mid')
const secureMid = require('../middlewares/secure.mid')

router.get('/projects',
  secureMid.auth, 
  projects.list)

router.get('/projects/client/:clientId', 
  secureMid.auth,
  projects.listByClient)

router.get('/projects/:id',
  secureMid.auth,
  projectsMid.exists,
  projects.detail)

router.post('/projects',
  secureMid.auth,
  projects.create)

router.patch('/projects/:id',
  secureMid.auth,
  projectsMid.exists,
  projectsMid.checkUser,
  projects.update)

router.delete('/projects/:id',
  secureMid.auth, 
  projectsMid.exists,
  projectsMid.checkUser, 
  projects.delete)

module.exports = router;