const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('PASSWORD', process.env.DATABASE_KEY);


mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("Connection successful");
})
  


app.listen(8000, () => {
console.log("Listening to the server on port 8000...");
});
