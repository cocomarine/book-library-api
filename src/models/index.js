const Sequelize = require('sequelize');
const ReaderModel = require('./reader');
const BookModel = require('./book');
const AuthorModel = require('./author');
const GenreModel = require('./genre');

const { PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env;

const setupDatabase = () => {
    const connection = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
        host: PGHOST,
        port: PGPORT,
        dialect: 'postgres',
        logging: false,
        define: { timestamps: false },
    });

    const Reader = ReaderModel(connection, Sequelize);
    const Book = BookModel(connection, Sequelize);
    const Author = AuthorModel(connection, Sequelize);
    const Genre = GenreModel(connection, Sequelize);

    Reader.hasMany(Book, {
        foreignKey: {
            allowNull: true,
            validate: {
                notEmpty: true,
            },
        },
    });
    Book.belongsTo(Reader, {
        foreignKey: {
            allowNull: true,
            validate: {
                notEmpty: true,
            },
        },        
    });
    Genre.hasMany(Book, {
        foreignKey: {
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });
    Book.belongsTo(Genre);
    Author.hasMany(Book, {
        foreignKey: {
            allowNull: false, 
            validate: {
                notEmpty: true,
                },
            },
        });
    Book.belongsTo(Author);

    connection.sync({ alter: true });
    return {
        Reader,
        Book,
        Author,
        Genre,
    };
};

module.exports = setupDatabase();
