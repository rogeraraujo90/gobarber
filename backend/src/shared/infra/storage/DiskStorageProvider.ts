import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/providers/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(filePath: string): Promise<string> {
    return filePath;
  }

  public async deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(uploadConfig.uploadsPath, fileName);
    const fileExists = await fs.promises.stat(filePath).catch(() => false);

    if (fileExists) {
      await fs.promises.unlink(filePath);
    }
  }
}

export default DiskStorageProvider;
