const express = require('express');
const router = express.Router();

todo = (req, res, next) => {
  res.send('TODO')
}

router.post('/auth/register', todo)
router.post('/auth/login', todo)

module.exports = router;