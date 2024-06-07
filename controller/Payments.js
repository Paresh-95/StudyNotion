const { instance } = require("../config/razorpay");
const Course = require("../model/Course");
const User = require("../model/User");
const mailSender = require("../utils/mailSender");

//capturee same course
//create order
//return response
//initiate razorpay order

exports.capturePayment = async (req, res) => {
  //get courseid and userid
  const { courseId } = req.body;
  const userId = req.user.id;
  //validation
  // valid courseid
  if (!courseId) {
    return res.json({
      success: false,
      message: "Please provide valid CourseID ",
    });
  }
  let course;
  try {
    //valid coursedetails
    course = await Course.findById(courseId);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the course",
      });
    }
    //user already pay or buyed the same course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentEnrolled.includes(userId)) {
      return res.status(200).json({
        success: false,
        message: "Student Already Enrolled",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not verify the course",
    });
  }

  //create order
  const amount = course.price;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: courseId,
      userId,
    },
  };
  try {
    //initiatize the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Could not initiate the order",
    });
  }

  //return response
  return res.status(200).json({
    success: true,
    courseName: course.courseName,
    courseDescription: course.courseDescription,
    thumbnail: course.thumbnail,
    orderId: paymentResponse.id,
    currency: paymentResponse.currency,
    amount: PaymentResponse.amount,
  });
};

//verify signature

exports.verifySignature = async (req, res) => {
  const webHookSecret = "1234567";
  const razorPaySignature = req.header["x-razorpay-signature"];
  const shaSum = crypto.createHmac("sha256", webHookSecret);
  shaSum.update(JSON.stringify(req.body));
  const digest = shaSum.digest("hex");

  if (signature === digest) 
  {
    //payment is authorized
    console.log("Payment is authorized");
    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      //fullfill the action
      //find the course and enroll the student in it
      const enrolledCourse = await Course.findByIdAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not found",
        });
      }

      console.log(enrolledCourse);

      //find the student and add the course in list of enrolled course
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: studentId },
        { $push: { courses: courseId } },
        { new: true }
      );

        //send email for buying the course confirmation
        const emailResponse = await mailSender(
            enrolledStudent.email,`Congratulation ${enrolledStudent.firstName}`,"Congratulation you have onboarded into new Codehelp Course"
        );

        //send success response

        return res.status(200).json({
            success:true,
            message:"Signature verified and Course Added"
        })


    } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Error while verifying signature",
        error:error.message
      });
    }
  }
  else
  {
    return res.status(400).json({
        success:false,
        message:"Invalid Request",
        error:error.message,
    })
  }
};
