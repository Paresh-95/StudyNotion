const ContactUs = require("../model/ContactUs");
const mailSender = require("../utils/mailSender");
exports.contactUs = async (req, res) => {
  try {
    //data fetch
    const { firstName, lastName, email, mobileNo, message } = req.body;
    //validation
    if (!firstName || !lastName || !email || !mobileNo || !message) {
      return res.status(401).json({
        success: false,
        message: "Need to fill all properties",
      });
    }
    //save in db
    const contactUsUserDetails = await ContactUs.create({
      firstName,
      lastName,
      email,
      mobileNo,
      message,
    });

    //send the message given by user to my email
    const EmailCompany = await mailSender(
      "pareshbhamare94@gmail.com",
      "Contact Us Query ",
      `firstName:${firstName}<br>lastName:${lastName}<br>email:${email}<br>MobileNo:${mobileNo}<br><br>Message:${message}`
    );

    //send email to use about data confirmation
    const emailConfirmationSend = await mailSender(
      email,
      `Hi,${firstName} <br> email:${email}`,
      `<span>Contact Us Reply Mail</span><br><br><h1> We got you We'll try to reach you within 1-2 bussiness Day</h1> `
    );

    //return response
    return res.status(200).json({
      success: true,
      messsage:
        "Query Registered Successfully Try to solve it as soon as possible",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error Contacting Us",
    });
  }
};
