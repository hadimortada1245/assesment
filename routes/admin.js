const express=require('express');
const router=express.Router();
const { createUser } = require('../controllers/admin');
const { authenticatUser }=require('../middlewares/authenticateUser')

router.post('/create-user',authenticatUser("Admin"),createUser);

module.exports=router;