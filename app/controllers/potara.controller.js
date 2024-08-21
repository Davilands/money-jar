const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu trữ ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
  }
});

const upload = multer({ storage: storage });


// exports.view = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded.' });
//     }
//     const imageUrl = `/uploads/${req.file.filename}`;
//     res.json({ message: 'File uploaded successfully.', imageUrl: imageUrl });
//     return res.send(svgString);
//   } catch (err) {

//     return res.send(svgString);
//   }
// };

exports.post = async (req, res, url) => {
  try {
    const { front, back } = req.body;
    const potara = {
      images: {
        front: {
          enable: true,
          data: front
        },
        back: {
          enable: false,
          data: back
        },
      },
      prop: [],
      view: `${url}/api/view?type=svg&id=`
    };

    const newPotara = new Potara(potara);
    const savedPotara = await newPotara.save();
    const potaraId = savedPotara._id;

    // Cập nhật view URL với ID của đối tượng đã lưu
    savedPotara.view = `${web_public_url}/api/view?type=svg&id=${potaraId}`;
    await savedPotara.save();

    res.status(201).send(savedPotara.view);
  } catch (err) {

    return res.send(err);
  }
};

exports.view = async (req, res) => {
  try {
    const type = req.query.type;
    const id = req.query.id;

    const potara = await Potara.findById(id);

    if (!potara)
      return res.json('none');

    if (type === 'svg') {

      const svgDat = `<svg xmlns="http://www.w3.org/2000/svg">
      <!-- Ảnh back -->
      <image href="${potara.images.front.data}" x="0" y="0" width="100%" height="100%" />
      
      <!-- Ảnh front -->
      <image href="${potara.images.back.data}" x="0" y="0"  width="100%" height="100%"  visibility="hidden"/>
      </svg>`

      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${id}</title>
      </head>
      <style>
        /* Đảm bảo các phần tử html và body chiếm toàn bộ không gian của trình duyệt */
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden; /* Loại bỏ thanh cuộn */
        }

        /* Đặt kích thước và vị trí của .svg-container */
        .svg-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Đặt kích thước và vị trí của SVG */
        svg {
            max-width: 100%;
            max-height: 100%;
        }
      </style>
      <body>
        <div class="svg-container">${svgDat}</div>
      </body>
      </html>
      `;

      res.status(200).send(htmlContent);
    }

  } catch (err) {

    return res.send(err);
  }
};

