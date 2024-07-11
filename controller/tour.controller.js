const express = require('express')
const Tour = require('../models/tour.model.js')
//const fs = require('fs');
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const router = express.Router();
router.param('xyz', (req,res,next,val)=>{
    console.log(`Tour id is ${val}`);
    next();
})
// exports.validPost = (req, res, next) => {
//     if(Object.keys(req.body).length === 0){
//         return res.status(404).json({
//             error : "Failed",
//             message : "Empty Tour"
//         })
//     }
//     next();
// }
// exports.checkId = (req, res, next, val) => {
//     if (req.params.xyz * 1 > tours.length) {
//         return res.status(404).json({
//             status: "Fail",
//             message: "Invalid id"
//         });
//     }
//     next();
// };
exports.getTour = async (req, res) => {
    // console.log(req.params.xyz);
    // const id = req.params.xyz * 1;
    //const tour = tours.filter(el => el.id === id);
    try {
        const tour = await Tour.findById(req.params.xyz)
        // Tour.findOne({__id : req.params.id})
        res.status(200).json({
        success: "true",
        data: {
            data : tour
        }
    });
    } catch (error) {
        res.status(404).json({
            error : "Id not found"
        })
    }
    
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.xyz, req.body, {new : true})
        res.status(201).json({
            success : true,
            data : {
                tour
            }
        })
    } catch (error) {
        res.status(400).json({
            success : "Failure",
            message : error
        })
    }
};
exports.getAllRoutes = async (req, res) => {
    try {
        const allTours = await Tour.find();
        res.status(200).json({
            success : "true",
            data : {
                data : allTours,
            }
        })
    } catch (error) {
        res.status(404).json({
            error : "Error in fetching tours"
        })
    }
};

exports.createTour = async (req, res) => {
    // const newTour = new Tour({})
    // newTour.save()  // old method without async await

    //Tour.create() serves the above same functionality
    try{
        const newTour = await Tour.create(req.body)
        res.status(201).json({
        status: "success",
        data: {
            tour: newTour
        }
    })
    }catch(err){
        res.status(404).json({
            error : "Invalid data set"
        })
    }
};
exports.deleteTour = async (req,res) => {
    try {
        await Tour.findByIdAndDelete(req.params.xyz);
        res.status(200).json({
            status : "success",
            data : {
                
            }
        })
    } catch (error) {
        res.status(404).json({
            success: "Failure",
            message : error
        })
    }
}