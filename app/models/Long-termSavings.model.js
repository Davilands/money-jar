const mongoose = require('mongoose');

const longTermSavingsSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId, // Đảm bảo sử dụng một giá trị mặc định
  },

});


const LongTermSavings = mongoose.model('potara', longTermSavingsSchema);

module.exports = LongTermSavings;