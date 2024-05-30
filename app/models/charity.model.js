const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId, // Đảm bảo sử dụng một giá trị mặc định
  },

});


const Charity = mongoose.model('potara', charitySchema);

module.exports = Charity;