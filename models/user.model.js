const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Name is required']
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
        select : false,
    },
    passwordConfirm : {
        type : String,
        required : true,
        validate : {
            validator: function(el){
                return el === this.password
            },
            message : ['Password are not the same']
        }
    },
    email : {
        type : String,
        required : [true,'Please provide your email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, 'Please provide a valid email']

    },
    role : {
        type : String,
        enum : ['user', 'admin', 'lead-guide'],
        default : 'user'
    },
    passwordChangedAt : Date,
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changeTime  = parseInt(this.passwordChangedAt.getTime()/1000,10)
         return changeTime > JWTTimestamp
    }
   
    return false;
}
const User = mongoose.model('User',userSchema)
module.exports = User