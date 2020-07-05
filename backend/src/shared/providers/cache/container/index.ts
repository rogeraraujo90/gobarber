import { container } from 'tsyringe';
import RedisCacheProvider from '../implementations/RedisCacheProvider';
import ICacheProvider from '../ICacheProvider';

const providers = {
  handlebars: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  providers.handlebars
);
