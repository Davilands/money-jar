const mongoose = require('mongoose');

const financialFreedomSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId, // Đảm bảo sử dụng một giá trị mặc định
  },

});


const FinancialFreedom = mongoose.model('potara', financialFreedomSchema);

module.exports = FinancialFreedom;