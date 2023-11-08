///////////// IMPORT /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import external middleware
import multer from "multer";

///////////// CONFIG //////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
export default upload;
