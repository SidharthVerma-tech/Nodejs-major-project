const fs = require('fs');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./../../models/tour.model')
dotenv.config({path : './config.env'});
const DB = process.env.DATABASE.replace(
    'PASSWORD',
    process.env.DATABASE_KEY
)
mongoose.connect(DB, {
}).then(()=>console.log("DB connection successful"));

// READ JSON FILE
console.log(process.argv);
const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8'));
// IMPORT DATA INTO DATABASE
console.log(tours)
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("Data succesfully loaded")
    } catch (error) {
        console.log(error)
    }
}

// DELETE DATA FROM DATABASE
const deleteData = async() =>{
    try {
        await Tour.deleteMany();

    } catch (error) {
        console.log(error)
    }
}
if(process.argv[2]==='--import'){
    importData()
}
if(process.argv[2] === '--delete'){
    deleteData()
    process.exit()
}
