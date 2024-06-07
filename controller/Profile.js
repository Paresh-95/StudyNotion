const Profile = require("../model/Profile");
const User = require("../model/User");
const Course = require("../model/Course")

exports.updateProfile = async (req,res)=>{
    try{
        //fetch details profile
        const {gender,dateOfBirth="",about="",contactNo} = req.body;
        const {id} = req.user.id;
        //validation
        if(!gender||!contactNo||!id){
            return res.status(401).json({
                success:false,
                message:"Missing Details Properties",
            })
        }
        //bring user
        const userDetails = await User.findById({id});  
        const profileId = userDetails.additionalDetails;
        //bring profile
        const profileDetails = await Profile.findById({id})
        //updated Profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNo = contactNo;

        await profileDetails.save();

        //return response
        return response.status(200).json({
            success:true,
            message:"Profile Updated Successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while Updating Profile",
            error:error.message,
        })
    }
}


//delete account
exports.deleteAccount = async (req,res)=>{
    try{
        //get id 
        const id = req.user.id; 
        //validation
        const userDetails = await User.findById({id});
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
        }
        // HW:unroll user from all enrolled courses
  
        //delete user profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //delete user
        await User.findByIdAndDelete({_id:id});
        //return repsonse
        return res.status(200).json("User and Profile Successfully deleted");

    }catch(error)
    {
        return res.status(500).json({
            success:false,
            messagee:"Error while deleting Account",
            error:error.message
        })
    }
}



//getAllUserDetails

exports.getAllUserDetails = async (req,res) =>{
    try{
        //get id
        const id = req.user.id;
        //validation
        if(!id)
        {
            return res.status(401).json({
                success:false,
                message:"Need All Properties ",
            })

        }
        //get user details and populate
        const allUserDetailsResponse = await User.findById(id).populate("additionalDetails").exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"User and Profile data fetch Successfull",
            allUserDetailsResponse
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"Error fetching User and Profile data",
        })
    }
}

