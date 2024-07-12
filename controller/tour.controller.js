const express = require('express')
const Tour = require('../models/tour.model.js');
const AppError = require('../utils/appError.js');
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
exports.aliasTours = (req,res,next) => {
    req.query.limit = '5',
    req.query.sort = 'price',
    req.query.fields = 'name,price,ratingsAvergage,difficulty,duration'
    next()
}
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
        // Step 1: Extract and log query parameters
        const queryObj = { ...req.query };

        // Step 2: Remove excluded fields and log the resulting query object
        const excludedFields = ['sort', 'page', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Step 3: Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        let query = Tour.find(JSON.parse(queryStr));

        // Step 4: Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Step 5: Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }
        // PAGINATION
        const page = req.query.page*1
        const limit = req.query.limit*1
        const skip = (page-1)*limit;
        query = query.skip(skip).limit(limit)
        if(req.query.page){
            const numTours = await Tour.countDocuments()
            if(skip >= numTours) throw new Error('This page does not exist')
        }
        // Step 6: Execute query and send response
        const allTours = await query;
        res.status(200).json({
            success: true,
            results : allTours.length,
            data: {
                tours: allTours,
            },
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error
        });
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

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { rating: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id : null,
                    numTours : {$sum : 1},
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
              
        ]);

        res.status(200).json({
            success: 'Success',
            data: {
                stats
            }
        });
    } catch (error) {
        res.status(404).json({
            success: 'Failure',
            message: error.message
        });
    }
};
exports.getMonthlyPlan = async(req, res) => {
    try {
        const year = req.params.year*1
        const monthlyTour = await Tour.aggregate([
            { $unwind : '$startDates'},
            {
                $match : {
                    startDates : {
                        $gte : new Date(`${year}-01-01`),
                        $lte : new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group : {
                    _id : {$month : '$startDates'},
                    numTourStarts : {$sum : 1},
                    tours : {$push : '$name'}
                }
            },
            {
                $addFields : {month : '$_id'}
            },
            {
                $project : {
                    _id : 0,
                }
            },
            {
                $sort : {

                }
            }
        ])
        res.status(200).json({
            monthlyTour
        })
    } catch (error) {
        res.status(404).json({
            success : 'Failure Mh bad',
            message : error
        })
    }
}
