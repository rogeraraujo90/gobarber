export default interface IStorageProvider {
  saveFile(filePath: string): Promise<string>;
  deleteFile(fileName: string): Promise<void>;
}
