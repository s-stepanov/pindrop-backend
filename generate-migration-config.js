const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const databaseConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,

  entities: ['**/*.entity{.ts,.js}'],

  migrationsTableName: 'migration',

  migrations: ['src/migrations/*.ts'],

  cli: {
    migrationsDir: 'src/migrations',
  },
};

fs.writeFile('./ormconfig.json', JSON.stringify(databaseConfig), () => {
  console.log('ormconfig.json created for current environment!');
});
