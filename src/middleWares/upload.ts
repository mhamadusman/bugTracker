import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/bugs");
  },

  filename: function (req, file, cb) {
    const fileName =
      "bug-" + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

export const uploadBugScreenshot = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/gif") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG and GIF images are allowed"));
    }
  }
});


