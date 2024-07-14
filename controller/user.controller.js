const express = require('express');
const User = require('../models/user.model')
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