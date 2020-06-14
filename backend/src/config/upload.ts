import crypto from 'crypto';
import path from 'path';
import multer from 'multer';

const uploadsPath = path.resolve(
  __dirname,
  '..',
  '..',
  'tmp',
  'uploaded_avatars'
);

export default {
  uploadsPath,

  storage: multer.diskStorage({
    destination: uploadsPath,
    filename(request, file, callback) {
      const hashedName = crypto.randomBytes(10).toString('hex');
      const fileName = `${hashedName}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
