export default interface ICacheProvider {
  save(key: string, value: unknown): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  remove(key: string): Promise<void>;
  removePrefix(prefix: string): Promise<void>;
}
