const mongoose = require('mongoose');

const playSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId, // Đảm bảo sử dụng một giá trị mặc định
  },

});


const Play = mongoose.model('potara', playSchema);

module.exports = Play;