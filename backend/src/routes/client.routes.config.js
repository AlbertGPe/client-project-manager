const express = require('express');
const router = express.Router();

const clients = require('../controllers/clients.controllers');
const clientsMid = require('../middlewares/client.mid')
const secureMid = require('../middlewares/secure.mid')

router.get('/clients',
  //secureMid.auth, 
  clients.list) //NEED JWT

router.get('/clients/:id',
  //secureMid.auth, 
  clientsMid.exists, 
  clients.detail) //NEED JWT (done)

router.post('/clients', 
  //secureMid.auth, 
  clients.create) //NEED JWT (done)

router.patch('/clients/:id', 
  //secureMid.auth, 
  clientsMid.exists, 
  clientsMid.checkUser,
  clients.update) //NEED JWT(done) - NEED OWNER (done)

router.delete('/clients/:id', 
  //secureMid.auth,
  clientsMid.exists,
  clientsMid.checkUser, 
  clients.delete) //NEED JWT(done) - NEED OWNER (done) 

module.exports = router;