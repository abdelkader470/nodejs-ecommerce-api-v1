const multer = require("multer");
const ApiError = require("../utils/ApiError");

const malterOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only Images allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => malterOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  malterOptions().fields(arrayOfFields);
