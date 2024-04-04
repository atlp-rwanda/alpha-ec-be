import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import os from 'os';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const cloudUpload = async (
  buffer: Buffer,
  fileName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tempFilePath = path.join(os.tmpdir(), fileName);

    fs.writeFile(tempFilePath, buffer, writeError => {
      if (writeError) {
        reject(writeError);
        return;
      }

      cloudinary.uploader.upload(
        tempFilePath,
        (
          uploadError: UploadApiErrorResponse | undefined,
          result: UploadApiResponse
        ) => {
          // fs.unlink(tempFilePath, unlinkError => {
          //   if (unlinkError) {
          //     return
          //   }
          // });

          if (uploadError) {
            reject(new Error(uploadError.message));
          } else {
            const uploadResult: string = result.secure_url;
            resolve(uploadResult);
          }
        }
      );
    });
  });
};

export const deleteCloudinaryFile = async (url: string) => {
  try {
    await cloudinary.uploader.destroy(url);
    return true;
  } catch (error) {
    return error;
  }
};
