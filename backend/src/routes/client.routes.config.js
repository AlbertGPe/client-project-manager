const express = require('express');
const router = express.Router();

const clients = require('../controllers/clients.controllers');
const clientsMid = require('../middlewares/client.mid')
const secureMid = require('../middlewares/secure.mid')

todo = (req, res, next) => {
  res.send('TODO')
}

router.get('/clients', clients.list) //NEED JWT
router.get('/clients/:id', clientsMid.exists, clients.detail) //NEED JWT
router.post('/clients', secureMid.auth, clients.create) //NEED JWT - NEED ADMIN
router.patch('/clients/:id', clientsMid.exists, clients.update) //NEED JWT - NEED ADMIN
router.delete('/clients/:id', clientsMid.exists, clients.delete) //NEED JWT - NEED ADMIN

module.exports = router;