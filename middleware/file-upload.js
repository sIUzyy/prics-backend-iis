const multer = require("multer");
const { v1: uuid } = require("uuid");

// helper what image type
const MIME_TYPE_MAP = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

const fileUpload = multer({
  // limits of file uploaded
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },

  // where the file will be stored
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images"); // store the image in this path
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype]; // file extension
      cb(null, uuid() + "." + ext);
    },
  }),

  // validate the file
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
