import multer from "multer";


const bugStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/bugs");
  },
   filename: (req , file , cb) => {
        cb(null, file.originalname)
    }
});

export const uploadBugScreenshot = multer({
  storage: bugStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/gif") {
      cb(null, true);
    } else {
      cb(new Error("Only png or gif allowed"));
    }
  }
});

const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/projects");
  },
   filename: (req , file , cb) => {
        cb(null, file.originalname)
    }
});

export const uploadProjectImage = multer({
  storage: projectStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/gif") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG or GIF allowed"));
    }
  }
});



const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/users");
  },
   filename: (req , file , cb) => {
        cb(null, file.originalname)
    }
});

export const uploadUserImage = multer({
  storage: userStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/gif" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("Only png or gif allowed"));
    }
  }
});