const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A name must be there'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    duration : {
        type : Number,
        required : [true, 'A tour must have duration'],
    },
    difficulty : {
        type : String,
        required : [true, 'A tour must have difficulty']
    },
    price: {
        type: Number,
        required: [true, 'Price must be there']
    },
    summary : {
        type: String,
        trime : true,
        required : [true, "Tour must have summary"]
    },
    ratingQuantity : {
        type : Number,
        default : 0
    },
    description : {
        type : String,
    },
    imageCover : {
        type : String,
        required : [true, 'Tour must have cover image']
    },
    images : [String],
    createdAt : {
        type : Date,
        default : Date.now()
    },
    startDates : [Date]

});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour