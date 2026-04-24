import 'reflect-metadata';
import { DataSource } from 'typeorm';

const isTsRuntime = __filename.endsWith('.ts');

const entities = isTsRuntime ? ['src/**/*.entity.ts'] : ['dist/**/*.entity.js'];

const migrations = isTsRuntime
  ? ['src/infrastructure/database/typeorm/migrations/*.ts']
  : ['dist/infrastructure/database/typeorm/migrations/*.js'];

const databaseUrl = process.env.DATABASE_URL?.trim();

const appDataSource = new DataSource({
  type: 'postgres',
  ...(databaseUrl
    ? {
        url: databaseUrl,
      }
    : {
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5433),
        username: process.env.DB_USERNAME ?? 'proyectoia_user',
        password: process.env.DB_PASSWORD ?? 'proyectoia_pass',
        database: process.env.DB_NAME ?? 'proyectoia_db',
      }),
  entities,
  migrations,
  synchronize: false,
});

export default appDataSource;
