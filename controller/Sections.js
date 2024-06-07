const Section = require("../model/Section");
const Course = require("../model/Course");

exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;
    //data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    //create section
    const newSection = await Section.create({
      sectionName,
    });
    //pull course
    //push object id of section in course
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { courseId },
      { $push: { courseContent: newSection._id } },
      { new: true }
    )
      .populate("Section")
      .populate("subSection")
      .exec();
    //success response
    return res.status(200).json({
      success: true,
      message: "Section created Succesfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section plz try again",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    //data input
    const { sectionName, sectionId } = req.body;
    //data validation
    if (!sectionName || !sectionId) {
      return res.status(401).json({
        success: false,
        message: "Missing Properties",
      });
    }
    //update data
    const updatedSection = await Section.findByIdAndUpdate(
      { sectionId },
      { sectionName },
      { new: true }
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Section updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating Section plz try again",
      error: error.message,
    });
  }
};


exports.deleteSection = async (req,res) =>{
   try{ 
    //bring id  - assuming we are sending id in params
    const {sectionId} = req.params;
    //validation
    if(!sectionId )
    {
      return res.status(401).json({
        success:false,
        message:"Missing section id",
      })
    }
    //delete the section
    const deletedSection = await Section.findByIdAndDelete({sectionId});
    //delete entry from course schema //we need to delete the entry from course schemea 
    

    //give response
    return res.status(200).json({
      success:true,
      message:"Message deleted Successfully",
      deletedSection
    })
    
   }
   catch(error)
   {
      return res.status(500).json({
        success:false,
        message:"Error while deleting the Section plz try again later",
        error:error.message
      })
   }
}