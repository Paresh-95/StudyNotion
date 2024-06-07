const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender")

const OtpSchema = new mongoose.Schema({
   email:{
        type:Sting,
        required:true,
   },
   otp:{
     type:String,
     required:true,
   },
   createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60,
   }
});

//function --> to send email
async function sendVerificationEmail(email,otp)
{
    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNotion Your Otp is: ",otp);
        console.log("Verification Email Send Successfully",mailResponse);
    }
    catch(error)
    {
      console.log("error occured while sending mail",error);
      throw error;
    }
}

OtpSchema.pre("save",async function(next){
  await sendVerificationEmail(this.email,this.otp)
  next();
})

module.exports = mongoose.model("OtpSchema", OtpSchema);
