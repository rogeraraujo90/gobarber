import ICacheProvider from '../ICacheProvider';

interface ICache {
  [key: string]: string;
}

class FakeCacheProvider implements ICacheProvider {
  private cache: ICache = {};

  public async save(key: string, value: unknown): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = this.cache[key];
    return data ? (JSON.parse(data) as T) : null;
  }

  public async remove(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async removePrefix(prefix: string): Promise<void> {
    const keysToRemove = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`)
    );

    keysToRemove.forEach(key => delete this.cache[key]);
  }
}

export default FakeCacheProvider;
