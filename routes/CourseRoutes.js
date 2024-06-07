const express = require("express");
const router = express();

const{
    createCourse,
    getAllCourse,
    getCourseDetails 
} = require("../controller/Course");


//categories controller import 
const{
    showAllCategories,
    createCategory,
    categoryPageDetails
} = require("../controller/Category");

const{
    createSection,
    updateSection,
    deleteSection
} = require("../controller/Sections");

const{
    createRatingReview,
    getAverageRatingReview,
    getAllRatingReview,
} = require("../controller/RatingAndReview")

//import middlewares

const {auth,isInstructor,isStudent,isAdmin } = require("../middlewares/auth");


//*************************************************************************************
//                  Course Routes
//*************************************************************************************

//course can only be created by instructor
router.post("/createCourse",auth,isInstructor,createCourse);

//add a section to a course
router.post("/addSection",auth,isInstructor,createSection);

//update a section
router.post("/updateSection",auth,isInstructor,updateSection);

//delete a section

router.post("/deleteSection",auth,isInstructor,deleteSection);

//Edit a Sub Section
router.post("/updateSubSection",auth,isInstructor,updateSection);

//Delete a Sub Section
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection);

//Add a Sub Section to a Section
router.post("/addSection",auth,isInstructor,addSection);

//Get all Registered Courses
router.post("/getAllCourse",getAllCourse);

//get details for a specific course
router.post("/getCourseDetails",getCourseDetails);

//***********************************************************************
//              Category Routes (Only By Admin)
//***********************************************************************

router.post("/createCategory",createCategory);
router.post("/showAllCategories",showAllCategories);
router.post("/getCategoryPageDetails",categoryPageDetails)


//*****************************************************************************
//              Rating And Review
//*****************************************************************************

router.post("/createRatingReview",createRatingReview);
router.post("/getAverageRating",getAverageRatingReview);
router.post("/getAllReview",getAllRatingReview)
