const express=require ('express')
const router=express.Router()
const passport=require('passport')

const userController=require('../controllers/User_Controller');

router.get('/admin',passport.checkAuthentication,userController.admin)

router.get('/employee',passport.checkAuthentication,userController.employee)

router.get('/register', userController.register);

router.get('/signin',userController.signin)

router.get('/signup',userController.signup)

router.post('/create',userController.createUser)

router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/signin'}
) ,userController.createSession)

router.get('/signout',userController.destroySession)

module.exports=router