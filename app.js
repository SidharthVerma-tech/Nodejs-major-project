
const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
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

 // ROUTE HANDLERS


// ROUTES

// MOUNTING THE ROUTER



app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app;
// IN OUR MAIN APP.JS WE MADE ONLY MIDDLEWARE GENERALLY


// STARTING THE SERVER
