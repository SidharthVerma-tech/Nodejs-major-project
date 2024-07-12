const mongoose = require('mongoose');
const slugify = require('slugify');

// Define the tour schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name must be there'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have duration'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty'],
  },
  secretTour : {
    type : Boolean,
    default : false
  },
  price: {
    type: Number,
    required: [true, 'Price must be there'],
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour must have summary'],
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
  slug: String,
});

// DOCUMENT MIDDLEWARE
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// OUERY MIDDLEWARE
tourSchema.pre('find', function(next){
    this.find({secretTour : { $ne : true}})
    next()
})

tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match : {secretTour :{ $ne : true}}})
    //console.log(this.pipeline());
    next();
})
// Create the model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
