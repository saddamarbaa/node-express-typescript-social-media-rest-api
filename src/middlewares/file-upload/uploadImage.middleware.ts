/* eslint-disable no-unused-vars */
import { Request, Express } from 'express';
import multer from 'multer';

import { getImageExtension } from '@src/utils';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Set Storage Engine
// Configuring and validating the upload
export const fileStorage = multer.diskStorage({
  destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
    callback(null, 'public/uploads/posts');
  },

  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
    callback(null, `${file.fieldname}-${Date.now()}${getImageExtension(file.mimetype)}`);
  },
});

// Initialize upload variable
export const uploadImage = multer({
  storage: fileStorage,
  limits: {
    fileSize: 1024 * 1024 * 10, // accept files up 10 mgb
  },
});

export default { uploadImage };
