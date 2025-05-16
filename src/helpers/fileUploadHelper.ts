import multer from "multer";
import { ICloudinaryResponse, IUploadFile } from "../interfaces/file";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "uploads/");
  },
  filename: function (req, file, cd) {
    cd(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: IUploadFile) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const FileUploadHelper = {
  upload,
  uploadToCloudinary,
};
