
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const express = require('express');
const filterObj = (obj, ...args) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if(args.includes(el)){
            newObj[el] = obj[el]
        }   
    })
    return newObj
}
exports.updateMe = async(req,res,next) => {
    // 1) Create Error if user post password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for profile update. Please use update Me', 400))
    } 
    
    // Filtered out unwanted fields that are now allowed to update, filterObj is a function
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new : true,
        runValidators : true
    })
    res.status(200).json({
        status : 'success',
        user : updatedUser
    })
}
exports.deleteMe = async(req,res,next) => {
    await User.findByIdAndUpdate(req.user.id, {active : false})
    res.status(204).json({
        status : 'success',
        data : null
    })
}
exports.getUsers = async(req,res) =>{
    try {
        const users = await User.find()
        res.status(200).json({
            data : {
                users
            }
        })
    } catch (error) {
        res.status(404).json({
            success : 'Failure',
            message : error
        })
    }
}



























// exports.createUser = (req, res) => {
//     res.status(404).json({
//         error : "Error",
//         message : "This route is not defined yet"
//     })
// }

// exports.getUser = (req, res) => {
//     res.status(404).json({
//         Error : "Error",
//         message : "This route is not defined yet"
//     })
// }
// exports.updateUser = (req, res) => {
//     res.status(404).json({
//         error : "error",
//         message : "This page is not defined yet"
//     })
// }

// exports.deleteUser = (req, res) => {
//     res.status(404).json({
//         error : "error",
//         message : "This route is not defined yet"
//     })
// }