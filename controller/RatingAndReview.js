const RatingAndReview = require("../model/RatingAndReview");
const Course = require("../model/Course");

//create Rating

exports.createRatingReview = async (req, res) => {
  try {
    //get userid
    const userId = req.user.id;
    //data fetch req.body
    const { rating, review, courseId } = req.body;
    //check if user enrolled or not
    const courseDetails = await Course.findOne(
      { _id: courseId },
      { studentEnrolled: { $elemMatch: { $eq: userId } } }
    );

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student not enrolled in the course",
      });
    }
    //check if user already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviews by the User",
      });
    }
    //create ratingReview
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      Course: CourseId,
      User: UserId,
    });
    //update the course with this ratingReview
    const UpdatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReview: ratingReview._id,
        },
      },
      { new: true }
    );
    console.log(UpdatedCourseDetails);
    //return response
    return res.status(200).json({
      sucess: true,
      message: "Rating and Review Submited Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//average Rating

exports.getAverageRatingReview = async (req, res) => {
  try {
    //get course id
    const courseId = req.body.CourseId;
    //calculate average rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    // return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    //if no rating review Exisst
    return res.status(200).json({
      success: false,
      message: "Average Rating is 0, no ratings given till now",
      averageRating: 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get All Rating

exports.getAllRatingReview = async (req, res) => {
  try {
    const allRatingReview = await RatingAndReview.find({})
      .sort({
        rating: "desc",
      })
      .populate({
        path: "User",
        select: "firstName lastName email image",
      })
      .populate({
        path: "Course",
        select: "courseName",
      })
      .exec();

      return res.status(200).json({
        success:true,
        message:"All Rating Reviews Fetched Successfully",
      })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
