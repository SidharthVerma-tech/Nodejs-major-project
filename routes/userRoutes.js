const express = require('express');
const userRouter = express.Router();
const {getAllUsers, createUser, getUser, updateUser, deleteUser} = require('../controller/user.controller')
userRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser);

userRouter
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)


module.exports = userRouter;