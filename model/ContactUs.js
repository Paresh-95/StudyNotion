const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
  Message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ContactUs", contactUsSchema);
