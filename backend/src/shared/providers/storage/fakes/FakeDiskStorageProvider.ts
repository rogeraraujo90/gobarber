import IStorageProvider from '../IStorageProvider';

class FakeDiskStorageProvider implements IStorageProvider {
  private files: string[] = [];

  public async saveFile(filePath: string): Promise<string> {
    this.files.push(filePath);
    return filePath;
  }

  public async deleteFile(fileName: string): Promise<void> {
    const fileIndex = this.files.findIndex(file => file === fileName);

    this.files.splice(fileIndex, 1);
  }

  public async readFile(filePath: string): Promise<string> {
    return `Reading ${filePath}`;
  }
}

export default FakeDiskStorageProvider;
