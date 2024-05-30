const mongoose = require('mongoose');

const necessitiesaSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId, // Đảm bảo sử dụng một giá trị mặc định
  },

});


const Necessitiesa = mongoose.model('potara', necessitiesaSchema);

module.exports = Necessitiesa;