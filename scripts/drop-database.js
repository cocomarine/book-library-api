const { Client } = require('pg');
const path = require('path');

const loadEnv = () => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV != 'production') {
    const envFile = '../.env.test';

    require('dotenv').config({
      path: path.join(__dirname, envFile),
    });

    const databaseName = process.env.PGDATABASE;

    delete process.env.PGDATABASE;

    return databaseName;
  }
};

const dropDatabase = async (databaseName) => {
  const client = new Client();

  try {
    await client.connect();

    console.log(`Dropping ${databaseName} database...`);

    await client.query(`DROP DATABASE ${databaseName}`);

    console.log('Database deleted');
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
};

const databaseName = loadEnv();
dropDatabase(databaseName);
