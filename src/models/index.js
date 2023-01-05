const Sequelize = require('sequelize');
const ReaderModel = require('./reader');
const BookModel = require('./book');

const { PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env;

const setupDatabase = () => {
    const connection = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
        host: PGHOST,
        port: PGPORT,
        dialect: 'postgres',
        logging: false,
    });

    const Reader = ReaderModel(connection, Sequelize);
    const Book = BookModel(connection, Sequelize);

    connection.sync({ alter: true });
    return {
        Reader,
        Book
    };
};

module.exports = setupDatabase();
