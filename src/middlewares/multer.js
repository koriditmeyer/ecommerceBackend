import multer from "multer"; // import external middleware

// MULTER CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static/img/products");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export function extractFile(fieldname,maxCount){
  //return upload.single(fieldname)
  return upload.array(fieldname, maxCount)
};
