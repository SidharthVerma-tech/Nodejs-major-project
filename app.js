
const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/error.controller')
app.use(express.json());
// Middleware to log requests
const middleware = (req, res, next) => {
    next();
};
 // MIDDLE WARES
 if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
 }
 app.use(middleware);
 app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    next();
 })

 // ROUTE HANDLERS ===> IN TOUR.CONTROLLER.JS


// ROUTES ====> IN TOUR.ROUTES.JS
//Middle
// MOUNTING THE ROUTER
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.all('*', (req,res,next)=>{
   // const err = new Error(`Cannt find ${req.originalUrl}`)
   // err.status = 'fail'
   // err.statusCode = 404
   next(new AppError(`Cant find ${req.originalUrl} on this server `, 404));
})
app.use(globalErrorHandler)
module.exports = app;
// IN OUR MAIN APP.JS WE MADE ONLY MIDDLEWARE GENERALLY


// STARTING THE SERVER
