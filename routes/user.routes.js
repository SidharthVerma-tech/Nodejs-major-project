const express = require('express')
const { getUsers, updateMe, deleteMe } = require('../controller/user.controller')
const { signup, login, forgotPassword, updatePassword, protected} = require('../controller/auth.controller')
const  {resetPassword} = require('../controller/auth.controller')
const userRouter = express.Router()

userRouter
    .route('/')
    .get(getUsers)
userRouter
    .route('/forgotPassword')
    .post(forgotPassword)

userRouter
    .route('/resetPassword/:token')
    .patch(resetPassword)

userRouter
    .route('/signup')
    .post(signup) 

userRouter
    .route('/login')
    .post(login)

    
userRouter
    .patch('/updateMyPassword',protected, updatePassword)

userRouter
    .patch('/updateMe', protected, updateMe)
userRouter
    .delete('/deleteMe', protected, deleteMe)


module.exports = userRouter