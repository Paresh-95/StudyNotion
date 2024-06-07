const SubSection = require("../model/SubSection");
const Section = require("../model/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    //fetch data from body
    const { title, timeDuration, description, sectionId } = req.body;
    //fetch file video
    const video = req.files.videofile;
    //validation
    if (!title || !timeDuration || !description || !sectionId) {
      return res.status(401).json({
        success: false,
        message: "Need all Properties",
      });
    }
    //upload video to cloudinary
    const videoUpload = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    //create subsection
    const newSubSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: videoUpload.secure_url,
    });
    //pull section and push subsection
    const updatedSubSection = await Section.findByIdAndUpdate(
      { sectionId },
      { $push: { subSection: newSubSection._id } },
      { new: true }
    )
      .populate("subSection")
      .exec();
    console.log(updatedSubSection);
    //response
    return res.status(200).json({
      success: true,
      message: "SubSection created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating Subsection",
      error: error.message,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    //data input
    const { title, timeDuration, description, subSectionId } = req.body;
    //data validation
    if (!title || !timeDuration || !description || !subSectionId) {
      return res.status(401).json({
        success: false,
        message: "Need all Properties",
      });
    }
    //update data
    const updatedSubSection = await SubSection.findByIdAndUpdate(
      { subSectionId },
      { title, timeDuration, description },
      { new: true }
    );
    //return response
    return res.status(200).json({
      success:true,
      message:"SubSection Updated Successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating Subsection plz try again later",
      error: error.message,
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    //bring id assuming id is send in params
    const {subSectionId} = req.params;
    //validation
    if(!subSectionId){
      return res.status(401).json({
        success:false,
        message:"Missing properties",
      })
    }
    //delete the section based on id 
    const deletedSubSection = await SubSection.findByIdAndDelete({subSectionId});
    //delete entry from coure schema
    //give response
    return res.status(200).json({
      success:true,
      message:"SubSection Deleted Successfully",
    })


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting Subsection plz try again later",
      error: error.message,
    });
  }
};
