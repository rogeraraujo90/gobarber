import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/providers/storage/IStorageProvider';
import { S3 } from 'aws-sdk';
import AppError from '@shared/errors/AppError';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({ region: 'sa-east-1' });
  }

  public async saveFile(filePath: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.uploadsPath, filePath);
    const file = await fs.promises.readFile(originalPath);

    if (!process.env.AVATARS_BUCKET) {
      throw new AppError(
        'AVATARS_BUCKET must be defined in order to user S3 driver'
      );
    }

    await this.client
      .putObject({
        Bucket: process.env.AVATARS_BUCKET,
        Key: filePath,
        ACL: 'public-read',
        Body: file,
      })
      .promise();

    return filePath;
  }

  public async deleteFile(fileName: string): Promise<void> {}

  public async readFile(filePath: string): Promise<string> {}
}

export default S3StorageProvider;
