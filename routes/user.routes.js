const express = require('express')
const { getUsers } = require('../controller/user.controller')
const { signup, login} = require('../controller/auth.controller')
const userRouter = express.Router()
userRouter
    .route('/')
    .get(getUsers)
    
userRouter
    .route('/signup')
    .post(signup) 

userRouter
    .route('/login')
    .post(login)
module.exports = userRouter