const express = require('express');
const router = express.Router();

const clients = require('../controllers/clients.controllers');
const clientsMid = require('../middlewares/client.mid')
const secureMid = require('../middlewares/secure.mid')

router.get('/clients',
  secureMid.auth, 
  clients.list)

router.get('/clients/:id',
  secureMid.auth, 
  clientsMid.exists, 
  clients.detail) 

router.post('/clients', 
  secureMid.auth, 
  clients.create)

router.patch('/clients/:id', 
  secureMid.auth, 
  clientsMid.exists, 
  clientsMid.checkUser,
  clients.update)

router.delete('/clients/:id', 
  secureMid.auth,
  clientsMid.exists,
  clientsMid.checkUser, 
  clients.delete) 

module.exports = router;