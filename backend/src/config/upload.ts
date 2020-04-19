import crypto from 'crypto';
import path from 'path';
import multer from 'multer';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'tmp', 'uploaded_avatars'),
    filename(request, file, callback) {
      const hashedName = crypto.randomBytes(10).toString('HEX');
      const fileName = `${hashedName}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
