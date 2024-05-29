const mongoose = require('mongoose');

const potaraSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: mongoose.Types.ObjectId, // Đảm bảo sử dụng một giá trị mặc định
  },
  images: {
    type: Object,
    properties: {
      front: {
        type: Object,
        properties: {
          enable: {
            type: Boolean,
            default: true
          },
          data: {
            type: String
          }
        }
      },
      back: {
        type: Object,
        properties: {
          enable: {
            type: Boolean,
            default: false
          },
          data: {
            type: String
          }
        }
      }
    }
  },
  prop: {
    Type: Array
  },
  view: {
    type: String
  },
  author: {
    type: String  //email
  }
});


const Potara = mongoose.model('potara', potaraSchema);

module.exports = Potara;