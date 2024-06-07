const express = require("express");
const router = express.Router();
const {auth} = require("../middlewares/auth");


const{
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    getEnrolledCourses,
    
} = require("../controller/Profile");

//****************************************************************************
//                              Profile routes
//****************************************************************************
//Delete User Account
router.delete("deleteProfile",auth,deleteAccount);
router.delete("/updateProfile",auth,updateProfile);
router.delete("/getUserDetails",auth,getAllUserDetails);


//Get Enrolled Courses
router.get('/getEnrolledCourses', auth, getEnrolledCourses);
router.put('/updateDisplayPicture', auth, updateDisplayPicture);

module.exports = router;