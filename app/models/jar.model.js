const mongoose = require('mongoose');

const jarSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId, // Đảm bảo sử dụng một giá trị mặc định
  },
  necessities: {
    type: String  //55%
  },
  education: {
    type: String  //10%
  },
  longTermSavings: {
    type: String  //5%
  },
  play: {
    type: String  //10%
  },
  financialFreedom: {
    type: String  //10%
  },
  charity: {
    type: String  //5%
  },
  others: {
    type: String  //5%
  },
});


const Jar = mongoose.model('jar', jarSchema);

module.exports = Jar;