const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const AppError = require('../utils/appError')
const getToken = (id) => {
    return jwt.sign({id : id}, process.env.JWT_SECRET_KEY)
}
exports.signup = async(req,res) => {
    try {
        const newUser = await User.create(req.body)
        const token = getToken(newUser._id)
        res.status(200).json({
            message : 'success',
            token,
            data : {
                user : newUser
            }
        })
    } catch (error) {
        res.status(404).json({
            success : 'failure',
            message : error
        })
    }
}
exports.login = async(req,res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return next(new AppError('Please provide both email and password', 400))
        }

        const user = await User.findOne({email}).select('+password')
        if(!user || !(await user.correctPassword(password, user.password))){
            return next(new AppError('Incorrect email or password', 404))
        } 
        const token = getToken(user._id)
        res.status(200).json({
            message : 'success',
            token,
            user
        })
    } catch (error) {
        res.status(404).json({
            status : 'Failure',
            message : "Tell me the error"
        })
    }
}
exports.protected = async(req,res,next) => {
    // Step 1 Get the token and check if it's there
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
        }
        console.log(token)
        if(!token){
            return next(new AppError('Please login first', 401))
        }
    // Step 2 Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)
    console.log(decoded)
    //Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user no longer exists'))
    }

    if(currentUser.changedPasswordAfter(decoded.iat)){
    return next(new AppError('Password change recently', 404))
    }
    req.user = currentUser
    next()
    } catch (error) {
        res.status(404).json({
            status : 'failure',
            message : error
        })
    }
}
exports.restrictedTo = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError('You are not allowed to perform this action', 403))
        }
        next()
    }
}
exports.forgotPassword = async(req, res) => {
    const user = await User.findOne({email : req.body.email});
    if(!user){
        return next(new AppError('There is no user with this email address'))
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave : false})

}