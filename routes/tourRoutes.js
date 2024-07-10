const express = require('express');
const tourRouter = express.Router();
const {getAllRoutes, createTour, getTour, updateTour,deleteTour, checkId, validPost} = require('../controller/tour.controller');
const fs = require('fs');
//tourRouter.param('xyz',checkId )
tourRouter
    .route('/')
    .get(getAllRoutes)
    .post(createTour);

tourRouter
    .route('/:xyz')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports= tourRouter;