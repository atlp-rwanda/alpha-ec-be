import multer, { FileFilterCallback } from 'multer';
import { NextFunction, Request, Response } from 'express';
import { cloudUpload } from '../utils';

const fileFilters = (files: Express.Multer.File, cb: FileFilterCallback) => {
  if (files.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  dest: 'uploads/',
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    fileFilters(file, cb);
  },
});

let images: Express.Multer.File[];

export const handleFileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.array('images')(req, res, async err => {
    if (err) {
      return res
        .status(500)
        .send({ data: [], message: 'Server error', error: err.message });
    }

    try {
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        images = req.files as Express.Multer.File[];
        req.body.images = images;
      }

      req.body = Object.fromEntries(
        Object.entries(req.body).filter(
          ([, v]) =>
            v !== '' &&
            v !== null &&
            v !== undefined &&
            !(Array.isArray(v) && v.length === 0) &&
            v !== 'string' &&
            v !== '0'
        )
      );

      next();
    } catch (uploadError) {
      const errorMessage =
        uploadError instanceof Error
          ? uploadError.message
          : 'An unknown error occurred';
      return res.status(500).send({
        data: [],
        message: 'Upload failed',
        error: errorMessage,
      });
    }
  });
};

export const uploadImages = async () => {
  const imageUrls: string[] = [];

  const uploadPromises = images.map(async image => {
    const { buffer, originalname } = image;
    const Url = await cloudUpload(buffer, originalname);
    imageUrls.push(Url);
  });

  await Promise.all(uploadPromises);
  return imageUrls;
};

export const singleFileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single('image')(req, res, async err => {
    if (err) {
      return res
        .status(500)
        .send({ data: [], message: 'Server error', error: err.message });
    }

    try {
      if (req.file) {
        const image = req.file as Express.Multer.File;
        const { buffer, originalname } = image;
        const Url = await cloudUpload(buffer, originalname);
        req.body.image = Url;
      }

      next();
    } catch (uploadError) {
      const errorMessage =
        uploadError instanceof Error
          ? uploadError.message
          : 'An unknown error occurred';
      return res.status(500).send({
        data: [],
        message: 'Upload failed',
        error: errorMessage,
      });
    }
  });
};
