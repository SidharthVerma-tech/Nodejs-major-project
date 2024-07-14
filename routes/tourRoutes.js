const express = require('express');
const tourRouter = express.Router();
const {getAllRoutes, createTour, getTour, updateTour,deleteTour, aliasTours, validPost, getTourStats, getMonthlyPlan} = require('../controller/tour.controller');
const {protected, restrictedTo} = require('../controller/auth.controller')
const fs = require('fs');
//tourRouter.param('xyz',checkId )
tourRouter
    .route('/get-monthly-plan/:year')
    .get(getMonthlyPlan)
tourRouter
    .route('/top-5-cheap')
    .get(aliasTours ,getAllRoutes)

tourRouter
    .route('/tour-stats')
    .get(getTourStats)
    
tourRouter
    .route('/')
    .get(protected,getAllRoutes)
    .post(createTour);
                                                     
tourRouter
    .route('/:xyz')
    .get(getTour)
    .patch(updateTour)
    .delete(protected, restrictedTo('lead-guide','admin'), deleteTour);



module.exports= tourRouter;