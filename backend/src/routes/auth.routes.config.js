const express = require('express');
const router = express.Router();
const user = require('../controllers/users.controllers')

todo = (req, res, next) => {
  res.send('TODO')
}

router.post('/auth/register', user.create)
router.post('/auth/login', todo)

module.exports = router;