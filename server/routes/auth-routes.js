const express = require('express');
const { signup, login, logout, protect } = require('../controllers/auth-controller');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});


module.exports = router;