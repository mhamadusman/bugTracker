import multer from "multer";
import path from 'path'

const bugStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/bugs");
  },

   filename: (req , file , cb) => {
      const fullName = path.basename(file.originalname)
      const cleanName = fullName.replace(/[^a-zA-Z0-9.\-_]/g, '-');
      const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const extension = path.extname(file.originalname);
      const name = path.basename(cleanName ,  extension);
      cb(null, `${name}-${uniqueId}${extension}`);
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
      const fullName = path.basename(file.originalname)
      const cleanName = fullName.replace(/[^a-zA-Z0-9.\-_]/g, '-');
      const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const extension = path.extname(file.originalname);
      const name = path.basename(cleanName ,  extension);
      cb(null, `${name}-${uniqueId}${extension}`);
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
      const fullName = path.basename(file.originalname)
      const cleanName = fullName.replace(/[^a-zA-Z0-9.\-_]/g, '-');
      const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const extension = path.extname(file.originalname);
      const name = path.basename(cleanName ,  extension);
      cb(null, `${name}-${uniqueId}${extension}`);
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