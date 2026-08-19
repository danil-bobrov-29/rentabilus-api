import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

const user = encodeURIComponent(env('DATABASE_USER'));
const password = encodeURIComponent(env('DATABASE_PASSWORD'));
const host = env('DATABASE_HOST');
const port = env('DATABASE_PORT');
const database = env('DATABASE_NAME');
const schema = env('DATABASE_SCHEMA');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: `postgresql://${user}:${password}@${host}:${port}/${database}?schema=${schema}`,
  },
});
