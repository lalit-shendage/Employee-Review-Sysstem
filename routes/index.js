const express =require('express');
const router =express.Router();
const passport = require('passport');

const userController=require('../controllers/User_Controller')

router.get('/', passport.checkAuthentication, userController.home);
router.use('/users', require('./users'))
router.use('/admin', require('./admin'))
router.use('/reviews', require('./reviews'));


module.exports=router