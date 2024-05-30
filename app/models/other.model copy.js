const mongoose = require('mongoose');

const otherSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId, // Đảm bảo sử dụng một giá trị mặc định
  },

});


const Other = mongoose.model('potara', otherSchema);

module.exports = Other;