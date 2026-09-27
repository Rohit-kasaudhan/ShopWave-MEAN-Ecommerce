// upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { nanoid } = require("nanoid");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const stem = file.originalname.split(".")[0];
    return {
      folder: "products",
      format: "webp",
      public_id: `${stem}-${nanoid(8)}`,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;