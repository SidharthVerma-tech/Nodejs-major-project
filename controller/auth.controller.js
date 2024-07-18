const crypto = require('crypto');
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')
const getToken = (id) => {
    return jwt.sign({id : id}, process.env.JWT_SECRET_KEY)
}
const createSendToken = (user,statusCode, res) => {
    const token = getToken(user._id)
    const cookieOptions =  {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24* 60 * 60 * 1000),
        httpOnly : true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions)
    user.password = undefined
    res.status(statusCode).json({
        status : 'success',
        token,
        data : {
            user
        }
    })
}
exports.signup = async(req,res) => {
    try {
        const newUser = await User.create(req.body)
        createSendToken(newUser, 201, res)
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
        createSendToken(user, 201, res)
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
exports.forgotPassword = async(req, res, next) => {
    const user = await User.findOne({email : req.body.email});
    if(!user){
        return next(new AppError('There is no user with this email address'))
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave : false})
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `Forgot your password ? Submit a patch request with your new password and password confirm
    to : ${resetURL} \n If you didn't forgot Ignore this email`
    try{
    await sendEmail({
        email : user.email,
        subject : 'Your password reset token only valid for 10 minutes',
        message
    })
    res.status(200).json({
        status : 'success',
        message : 'Token sent to the email'
    })
}catch(err){
    user.passwordResetToken = undefined,
    user.passwordResetExpires = undefined,
    await user.save({validateBeforeSave : false})
    return next(new AppError('There was error sending the email. Try again later', 500))
}

}
exports.resetPassword= async(req,res,next) => {
    // Get user based on the token
    try{
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
        const user = await User.findOne({passwordResetToken : hashedToken, 
            passwordResetExpires : {$gt : Date.now()}
        })

        if(!user){
            return next(new AppError('Token is invalid or expires', 404))
        }
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined

        await user.save()

        const token = getToken(user._id);
        res.status(200).json({
            status : 'success',
            token
        })
    }catch(err){
        res.status(404).json({
            status : 'Failure',
            message : err.message
        })
    }
};
exports.updatePassword = async(req,res,next) => {
    // Get user from the collection
    try{
    const user = await User.findById(req.user.id).select('+password')
    // Check if posted current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError('Your current password is wrong', 401))
    }
    // If so, update the password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    //User.findById and Update will not work because 
    // we used this keyword which points to object and mongo does not store object reference
    
    createSendToken(user, 201, res)

    }catch(err){
        res.status(404).json({
            status : 'Failed',
            message : err.message
        })
    }

    //Log user in, Send JWT
}
