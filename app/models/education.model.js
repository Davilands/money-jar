const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId, // Đảm bảo sử dụng một giá trị mặc định
  },

});


const Education = mongoose.model('potara', educationSchema);

module.exports = Education;