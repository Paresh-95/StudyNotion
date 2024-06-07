const Category = require("../model/Category");

exports.createCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //create entry in db
    const categoryDetail = await Category.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: message.error,
    });
  }
};

//getAllTags
exports.showAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: "All Category Returned Successfully",
      allTags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//category page details

exports.categoryPageDetails = async (req, res) => {
  try {
    //get category id
    const { categoryId } = req.body;
    //get courses for specified category id
    const specifiedCategory = await Category.findById({ categoryId })
      .populate("Course")
      .exec();
    //validation
    if (!specifiedCourse) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found",
      });
    }

    //get course for different category course,
    const differentCategory = await Category.find({ _id: { $ne: categoryId } }).populate("Courses").exec();
    //get top 10 selling course
    // HW:


    //return
    return res.status(200).json({
        success:true,
        message:"Data fetched Succesfull",
        data:{
            selectedCategory,
            differentCategory,
        }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
