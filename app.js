const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/error.controller');
const userRouter = require('./routes/user.routes');
const app = express();
app.use(helmet())
app.use(xss())
app.use(hpp({
   whitelist : ['duration', 'rating', 'ratingQuantity', 'difficulty', 'price']
}))
app.use(mongoSanitize())
app.use(express.json({limit : '10kb'}));

// Data sanitization against NOSQL query injections

// Data Sanitization against XSS
// Middleware to log requests
const middleware = (req, res, next) => {
    next();
};
 // MIDDLE WARES

// app.use();
 // Development Logging
 if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
 }

 const limiter = rateLimit({
   max : 300,
   windowMs : 60*60*1000,
   message : 'Too many requests from this IP, please try again in an hour !'

 })
 app.use('/api', limiter)
 app.use(middleware);
 app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    console.log(req.headers)
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
