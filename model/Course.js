const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({

    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,

    },
    courseContent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    },
    ratingAndReview:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    },
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:[String],
        required:true,
    },
    category:{
        type:String,
        ref:"Category",
    },
    studentEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    instruction:{
        type:[String],
    },
    status:{
        type:String,
        enum:["Draft","Published"], 
    },
    
});

module.exports = mongoose.model("CourseSchema", CourseSchema);
