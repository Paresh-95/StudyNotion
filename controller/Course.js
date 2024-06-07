const Course = require("../model/Course");
const User = require("../model/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Category = require("../model/Category");

//createCourse handler fuction
exports.createCourse = async (req, res) => {
  try {
    // fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, Category } =
      req.body;
    //fetch thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !Category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are neccessary",
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log(instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    //check given Category is valid or not
    const categoryDetail = await Category.findById({ Category });
    if (!categoryDetail) {
      return res.status(404).json({
        success: false,
        message: "Category Details not found",
      });
    }

    //upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    //create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      category: categoryDetail._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //update Instructor course list
    //add new couree to user schema of instructor

    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //update the Category schema

    await Category.findByIdAndUpdate(
      { _id: categoryDetail._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //return response

    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      date: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Create Course",
      error: error.message,
    });
  }
};

//getAllCourse handler function

exports.showAllCourse = async (req, res) => {
  try {
    //change the below statement incrementals
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReview: true,
        studentEnrolled: true,
      }
        .populate("instructor")
        .exec()
    );
    return res.status(200).json({
      success: true,
      message: "Data fetched Successfully",
      data: allCourses,
    });

    console.log(allCourses);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while Fetching courses",
      error: error.message,
    });
  }
};

//not sure

exports.getCourseDetails = async (req, res) => {
  try {
    //get id
    const { courseId } = req.body;
    //validation
    if (!courseId) {
      return res.status(401).json({
        success: false,
        message: "Need All Properties ",
      });
    }
    //get user details and populate
    const courseDetails = await User.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Couldn't not find the course with the ${courseId} `,
      });
    }
    //return response
    return res.status(200).json({
      success: true,
      message: "Course Deatils data fetch Successfully",
      allUserDetailsResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching Course Details",
    });
  }
};
