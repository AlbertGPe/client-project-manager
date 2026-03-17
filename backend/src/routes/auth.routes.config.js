const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controllers')
const usersMid = require('../middlewares/user.mid')

router.get('/users/:id/confirm', usersMid.exists, users.confirm)
router.post('/auth/register', users.create)
router.post('/auth/login', users.login)

module.exports = router;