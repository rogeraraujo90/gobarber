export default interface IStorageProvider {
  saveFile(filePath: string): Promise<string>;
  deleteFile(fileName: string): Promise<void>;
  readFile(filePath: string): Promise<string>;
}
