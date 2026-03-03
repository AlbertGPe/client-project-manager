const express = require('express');
const router = express.Router();

todo = (req, res, next) => {
  res.send('TODO')
}

router.get('/clients', todo) //NEED JWT
router.get('/clients/:id', todo) //NEED JWT
router.post('/clients', todo) //NEED JWT - NEED ADMIN
router.put('/clients/:id', todo) //NEED JWT - NEED ADMIN
router.delete('/clients/:id', todo) //NEED JWT - NEED ADMIN

module.exports = router;