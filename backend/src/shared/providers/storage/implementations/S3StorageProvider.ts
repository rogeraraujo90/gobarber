import path from 'path';
import fs from 'fs';
import mime from 'mime';

import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/providers/storage/IStorageProvider';
import { S3 } from 'aws-sdk';
import AppError from '@shared/errors/AppError';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  private avatarsBucket: string;

  constructor() {
    if (!process.env.AVATARS_BUCKET) {
      throw new AppError(
        'AVATARS_BUCKET must be defined in order to user S3 driver'
      );
    }

    this.avatarsBucket = process.env.AVATARS_BUCKET;
    this.client = new S3({ region: 'sa-east-1' });
  }

  public async saveFile(filePath: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.uploadsPath, filePath);
    const file = await fs.promises.readFile(originalPath);
    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new AppError('Avatar file not found');
    }

    await this.client
      .putObject({
        Bucket: this.avatarsBucket,
        Key: filePath,
        ACL: 'public-read',
        Body: file,
        ContentType: contentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return filePath;
  }

  public async deleteFile(fileName: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: this.avatarsBucket,
        Key: fileName,
      })
      .promise();
  }

  public async readFile(filePath: string): Promise<string> {}
}

export default S3StorageProvider;
