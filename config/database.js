const mongoose  = require("mongoose");
require("dotenv").config();

exports.dbConnect = () =>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log("DB Connected Successfully"))
    .catch( (error)=>{
        console.log("Error Connecting to DB");
        console.error(error);
        process.exit(1);
    })
};