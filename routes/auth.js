const express =require('express');
const router=express.Router();
const { register, login, resetPassword, forgetPassword, verifyEmail } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/forget-password', forgetPassword);
router.get('/verify-email/:token', verifyEmail);

module.exports = router;