const mongoose =require('mongoose');
const colors =require('colors');
//function mongodb databaseconnection
 const connectDb = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to database${mongoose.connection.host}`.bgCyan);
    } catch (error) {
        console.log('Db error',error);
    }
};

module.exports = connectDb;