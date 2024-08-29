const express =require('express');
const router=express.Router();
const { register, login, verifyEmail } = require('../controllers/authController');
const { requestPasswordReset , resetPassword } = require('../controllers/passwordController');


router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/forget-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;