import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import path from "path";

const generateSafeName = (file: Express.Multer.File) => {
  console.log('inside generate file name')
  const safeBaseName = path.basename(file.originalname);
  const extension = path.extname(safeBaseName);
  const cleanName = path.basename(safeBaseName, extension).replace(/[^a-zA-Z0-9]/g, '-');
  const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
  return `${cleanName}-${uniqueId}`;
};

const createStorage = (folderName: string) => {
   console.log('inside create storage')
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: `bugTracker/${folderName}`,
        public_id: generateSafeName(file),
      };
    },
  });
};

export const uploadBugScreenshot = multer({
  storage: createStorage('bugs'),
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only png or gif allowed") as any, false);
    }
  }
});

export const uploadProjectImage = multer({
  storage: createStorage('projects'),
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG or GIF allowed") as any, false);
    }
  }
});

export const uploadUserImage = multer({
  storage: createStorage('users'),
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only png or gif allowed") as any, false);
    }
  }
});